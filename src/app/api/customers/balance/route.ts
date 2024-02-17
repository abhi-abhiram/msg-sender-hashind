import { type NextRequest } from "next/server";
import { getServerSession, } from "next-auth";
import axios from "axios";
import { env } from "~/env";

export async function GET(req: NextRequest,) {

    const session = await getServerSession();

    if (!session?.user) {
        return new Response(null, { status: 401 });
    }


    const url = `${env.FAST_2_SMS}/wallet?authorization=${env.FAST_2_SMS_API_KEY}`

    const balance = (await axios.get<{ wallet: number }>(url)).data.wallet

    return new Response(JSON.stringify({ balance }), {
        headers: {
            "Content-Type": "application/json",
        },
    });
}