import { TRPCError } from "@trpc/server";
import { randomUUID } from "crypto";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { customers } from "~/server/db/schema";
import { template_data } from "~/templates-data"
import axios from "axios";
import { env } from "~/env";


export const customerRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    name: z.string(),
    email: z.string().email(),
    dob: z.date().optional(),
    phone_no: z.string(),
    aniversary: z.date().optional(),
  })).mutation(async ({ ctx, input }) => {
    const { email, name, dob, phone_no, aniversary } = input;

    const id = randomUUID();

    await ctx.db.insert(customers).values({
      id,
      email,
      name,
      phone_no,
      aniversary,
      dob,
    })

    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, id)
    })

    if (!customer) {
      throw new TRPCError({
        message: "Customer not found",
        code: "INTERNAL_SERVER_ERROR"
      })
    }

    return customer;
  }),

  get: protectedProcedure.input(z.object({
    id: z.string()
  })).query(async ({ ctx, input }) => {
    const { id } = input;

    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, id)
    })

    if (!customer) {
      throw new TRPCError({
        message: "Customer not found",
        code: "INTERNAL_SERVER_ERROR"
      })
    }

    return customer;
  }),

  all: protectedProcedure.query(async ({ ctx }) => {
    const customersList = await ctx.db.query.customers.findMany();

    return customersList;
  }),

  send_messages: protectedProcedure.input(z.object({
    messageId: z.string(),
    customers: z.array(z.object({
      phone_no: z.string(),
      name: z.string(),
    })),
    celebration_name: z.string().optional()
  })).mutation(async ({ input }) => {
    const { messageId, customers } = input;

    const message = template_data.find((data) => data.message === messageId);

    if (!message) {
      throw new TRPCError({
        message: "Message not found",
        code: "BAD_REQUEST"
      })
    }

    if (message.type === "custom" && !input.celebration_name) {
      throw new TRPCError({
        message: "Celebration name is required",
        code: "BAD_REQUEST"
      })
    }

    const promises = customers.map(async ({ name, phone_no }) => {
      const url = `${env.FAST_2_SMS}?authorization=${env.FAST_2_SMS_API_KEY}&route=dlt&sender_id=${message.sender_id}&message=${messageId}&variables_values=${message.type === "custom" ? name + "|" + input.celebration_name : name}&flash=0&numbers=${phone_no}`;

      return axios.get(url);
    });

    try {
      await Promise.all(promises);
    } catch (error) {
      console.log(error);
      throw new TRPCError({
        message: "Error while sending messages",
        code: "INTERNAL_SERVER_ERROR"
      })
    }

    return true;
  })
});


// let url = `${process.env.FAST_2_SMS}?authorization=${process.env.API_KEY}&route=dlt&sender_id=${senderId}&message=${messageId}&variables_values=${str}&flash=0&numbers=${phoneNumber}`;


//`${process.env.FAST_2_SMS}?authorization=${process.env.API_KEY}&route=dlt&sender_id=${senderId}&message=${messageId}&variables_values=${str}&flash=0&numbers=${mobileArr[i]}`;

