import { db } from "~/server/db";
import xlsx from "node-xlsx";
import { format } from "date-fns";
import { type NextRequest } from "next/server";
import { getServerSession, } from "next-auth";

export async function GET(req: NextRequest,) {

    const session = await getServerSession();

    if (!session?.user) {
        return new Response(null, { status: 401 });
    }


    const customers = await db.query.customers.findMany();


    const data = [
        ["first_name", "last_name", "email", "phone_no", "dob", "anniversary"],
        ...customers.map((customer) => [
            customer.first_name,
            customer.last_name,
            customer.email,
            customer.phone_no,
            format(customer.dob, "P"),
            format(customer.anniversary, "P")
        ]),
    ];

    const buffer = xlsx.build([{ name: "Customers", data, options: {} }]);

    return new Response(buffer, {
        headers: {
            "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": "attachment; filename=customers.xlsx",
        },
    });
}