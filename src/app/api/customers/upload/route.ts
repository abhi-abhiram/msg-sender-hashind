// import xlsx from "node-xlsx";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { getServerSession } from "next-auth";
import * as xlsx from "xlsx"
import * as z from "zod";



const Customer = z.array(z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email(),
    phone_no: z.string(),
    dob: z.string().transform((dob) => new Date(dob)),
    anniversary: z.string().transform((anniversary) => new Date(anniversary))
}))


export async function POST(req: Request,) {


    const session = await getServerSession();

    if (!session?.user) {
        return new Response(null, { status: 401 });
    }

    const data = await req.formData();

    const file: File | null = data.get('file') as File;

    if (!file) {
        return new Response('No file found', { status: 400 });
    }

    const buffer = await file.arrayBuffer();

    const workbook = xlsx.read(buffer, {
        type: "buffer",
    })


    const sheet = workbook.Sheets[workbook.SheetNames[0]!];

    if (!sheet) {
        return new Response('No sheet found', { status: 400 });
    }

    const customerxlsx = xlsx.utils.sheet_to_json(sheet);

    try {
        const values = Customer.parse(customerxlsx)
        await db.insert(customers).values(values)
        return new Response('File uploaded', { status: 200 });
    } catch (error) {
        return new Response('Invalid file', { status: 400 });
    }

}