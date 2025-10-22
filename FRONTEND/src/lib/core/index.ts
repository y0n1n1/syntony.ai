import { z } from "zod"



export const rankItems = [
    {
      id: "rankDefault",
      label: "Default",
    },
    {
      id: "rankCitations",
      label: "Citations",
    },
    {
      id: "rankDate",
      label: "Date",
    },
    {
      id: "rankFocus",
      label: "Focus",
    },
    {
      id: "rankTrending",
      label: "Trending",
    },
  ] as const

export const SearchFiltering = z.object({
    default: z.boolean(),
    citations: z.boolean(),
    latest: z.boolean(),
    trending: z.boolean(),
    areas:z.string(),
    topics:z.string(),
    keywords:z.string(),
    authors:z.string(),
    publicationsConferences:z.string(),
    startDate:z.date(),
    endDate:z.date(),
  })