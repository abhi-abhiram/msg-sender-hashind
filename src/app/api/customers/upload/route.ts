import xlsx from "node-xlsx";
import { db } from "~/server/db";
import { customers } from "~/server/db/schema";
import { getServerSession } from "next-auth";


const columns = [
    'first_name',
    'last_name',
    'email',
    'phone_no',
    'dob',
    'anniversary'
] as const;


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

    const workBook = xlsx.parse(buffer);

    const customerxlsx = workBook[0]?.data;


    if (!customerxlsx) {
        return new Response('No customers found', { status: 400 });
    }

    // Validate headers
    const headers = customerxlsx[0] as unknown as typeof columns;
    const headerSet = new Set(headers);
    const missingColumns = columns.filter(col => !headerSet.has(col));
    if (missingColumns.length > 0) {
        return new Response(`Missing columns: ${missingColumns.join(', ')}`, { status: 400 });
    }

    // Remove headers
    const customersData = customerxlsx.slice(1) as string[][];

    // Validate data and convert to db format
    const customersValues = customersData.map((customer) => {
        const customerData = customer.reduce((acc, value, index) => {
            const col = headers[index]!;

            // Validate required fields
            if (col === "first_name" || col === "last_name" || col === "phone_no" || col === "dob" || col === "anniversary") {
                if (!value) {
                    throw new Error(`Invalid value for ${col}`);
                }
            }

            // convert date strings to date objects
            if (col === "dob" || col === "anniversary") {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    throw new Error(`Invalid date format for ${col}`);
                }
                acc[col] = date;
                return acc;
            }

            acc[col] = value;

            return acc;
        }, {} as typeof customers.$inferInsert);

        return customerData;
    });


    await db.insert(customers).values(customersValues)


    return new Response('File uploaded', { status: 200 });

}