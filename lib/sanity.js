import { createClient, createPreviewSubscriptionHook } from "next-sanity";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";
const config = {
  projectId: "u0xeglho",
  dataset: "production",
  apiVersion: "2021-03-25",
  useCdn: false,
};
export const sanityClient = createClient(config);

export const usePreview = createPreviewSubscriptionHook(config);

const builder = imageUrlBuilder(sanityClient);

export const urlFor = (source) => builder.image(source);

export const PortableTextComponent = PortableText;
