import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
const trips = defineCollection({ loader: glob({ pattern: '**/*.mdx', base: './src/content/trips' }), schema: ({image}) => z.object({
 title: z.string(), subtitle: z.string(), status: z.enum(['draft','review','approved','published']), visibility: z.enum(['public','unlisted','private']), tripStart: z.coerce.date(), tripEnd: z.coerce.date(), country: z.string(), continent: z.enum(['ASIA','EUROPE','AFRICA','NORTH AMERICA','SOUTH AMERICA','OCEANIA']), volume: z.number().int().positive().optional(), datePrecision: z.enum(['day','month']).default('day'), regions: z.array(z.string()), pin: z.object({lat: z.number().min(-90).max(90), lng: z.number().min(-180).max(180)}).optional(), summary: z.string(), cover: image(), coverAlt: z.string(), featured: z.boolean().default(false), sample: z.boolean().default(false), tags: z.array(z.string()).default([])
}).refine(d=>d.tripEnd>=d.tripStart,{message:'여행 종료일은 시작일 이후여야 합니다.'}) });
export const collections = { trips };
