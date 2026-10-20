import imageUrlBuilder from "@sanity/image-url";
import { dataset, projectId } from "../env";

const builder = imageUrlBuilder({ projectId: projectId || "placeholder", dataset });

export const urlFor = (source: any) => builder.image(source);
