import { TRPCError } from "@trpc/server";
import { desc, eq, like, or, countDistinct } from "drizzle-orm";
import * as z from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { customers, feedbacks } from "~/server/db/schema";
import { template_data } from "~/templates-data"
import axios from "axios";
import { env } from "~/env";
import { type KPIs } from "~/app/(afterlogin)/feedback/feedback-form";


const MEDIAN_SCORE = 17;


export const customerRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email().optional(),
    dob: z.date(),
    phone_no: z.string(),
    anniversary: z.date(),
  })).mutation(async ({ ctx, input }) => {
    const { email, first_name, last_name, dob, phone_no, anniversary } = input;


    await ctx.db.insert(customers).values({
      email,
      first_name,
      last_name,
      phone_no,
      anniversary,
      dob,
    })

    return true;
  }),

  get: protectedProcedure.input(z.object({
    id: z.number()
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
  }),

  edit: protectedProcedure.input(z.object({
    id: z.number(),
    first_name: z.string(),
    last_name: z.string(),
    email: z.string().email().optional(),
    dob: z.date(),
    phone_no: z.string(),
    anniversary: z.date(),
  })).mutation(async ({ ctx, input }) => {
    const { id, email, first_name, last_name, dob, phone_no, anniversary } = input;

    await ctx.db.update(customers).set({
      email,
      first_name,
      last_name,
      phone_no,
      anniversary,
      dob,
    }).where(eq(customers.id, id))

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

  delete: protectedProcedure.input(z.object({
    id: z.number(),
  })).mutation(async ({ ctx, input }) => {
    const { id } = input;

    await ctx.db.delete(customers).where(eq(customers.id, id))

    return true;
  }),

  sendFeedbackMsg: protectedProcedure.input(z.object({
    id: z.union([z.number(), z.string()]),
    feedback: z.record(z.number().min(1).max(4)),
    visitingTime: z.enum(["morning", "afternoon", "evening_snacks", "dinner"])
  })).mutation(async ({ ctx, input }) => {
    const { id, feedback } = input;

    const customer = await ctx.db.query.customers.findFirst({
      where: eq(customers.id, typeof id === "string" ? parseInt(id) : id)
    })

    if (!customer) {
      throw new TRPCError({
        message: "Customer not found",
        code: "INTERNAL_SERVER_ERROR"
      })
    }

    const score = Object.values(feedback).reduce((acc, curr) => acc + curr, 0);

    const message = score >= MEDIAN_SCORE ? template_data.find((data) => data.message === "163054") : template_data.find((data) => data.message === "163058");

    if (!message) {
      throw new TRPCError({
        message: "Message not found",
        code: "BAD_REQUEST"
      })
    }

    await ctx.db.insert(feedbacks).values({
      feedback: {
        ...feedback as Record<typeof KPIs[number], number>,
      },
      customer_id: customer.id,
      visitingTime: input.visitingTime
    })

    const url = `${env.FAST_2_SMS}?authorization=${env.FAST_2_SMS_API_KEY}&route=dlt&sender_id=${message.sender_id}&message=${message.message}&variables_values=${customer.first_name}&flash=0&numbers=${customer.phone_no}`;

    return axios.get(url).then(() => true).catch(() => {
      throw new TRPCError({
        message: "Error while sending messages",
        code: "INTERNAL_SERVER_ERROR"
      })
    });
  }),

  paginate: protectedProcedure.input(z.object({
    cursor: z.number().nullish(),
    limit: z.number().min(1).max(100).nullish(),
    search: z.string().optional(),
  })).query(async ({ ctx, input }) => {
    const { cursor, search } = input;
    const limit = input.limit ?? 10;
    const query = ctx.db.select().from(customers).orderBy(desc(customers.id));

    let customersList: typeof customers.$inferSelect[];

    if (search) {
      const searchQuery = or(
        like(customers.first_name, `%${search}%`),
        like(customers.last_name, `%${search}%`),
        like(customers.phone_no, `%${search}%`),
        like(customers.email, `%${search}%`),
      );
      customersList = await query.where(searchQuery);
    } else {
      customersList = await query.offset(
        cursor ? cursor * limit : 0
      ).limit(limit);
    }

    let total: number | null = null;

    if (!cursor) {
      total = (await ctx.db.select({ total: countDistinct(customers.id) }).from(customers))[0]?.total ?? null;
    }

    return {
      customers: customersList,
      nextCursor: customersList[customersList.length - 1]?.id ?? null,
      total
    }
  }),

  dashboard: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.select().from(feedbacks).orderBy(desc(feedbacks.created_at));
  })
});


// let url = `${process.env.FAST_2_SMS}?authorization=${process.env.API_KEY}&route=dlt&sender_id=${senderId}&message=${messageId}&variables_values=${str}&flash=0&numbers=${phoneNumber}`;


//`${process.env.FAST_2_SMS}?authorization=${process.env.API_KEY}&route=dlt&sender_id=${senderId}&message=${messageId}&variables_values=${str}&flash=0&numbers=${mobileArr[i]}`;


// b6948139-f8cc-4fc8-8272-286b9f577a89



// SELECT
// 	*
// FROM
// 	`hashind-project_customer`
// WHERE
// 	first_name LIKE '%ab%'
// 	OR last_name LIKE '%ab%'
// 	OR phone_no LIKE '%ab%'
// 	OR last_name LIKE '%ab%'
// ORDER BY
// 	created_at DESC
// LIMIT 10;
