import { processEnv } from "@next/env";
import { async } from "rxjs";
import { sanityClient } from "../../lib/sanity";

sanityClient.config({
  token: process.env.SANITY_TOKEN,
});

export default async function likeButtonHandler(req, res) {
  const { _id } = JSON.parse(req.body);
  const data = await sanityClient
    .patch(_id)
    .setIfMissing({ likes: 0 })
    .inc({ likes: 1 })
    .commit()
    .catch((err) => console.error(err));

  res.status(200).json({ likes: data.likes });
}
