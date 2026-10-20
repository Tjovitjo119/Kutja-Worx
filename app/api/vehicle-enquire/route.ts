import { handleEnquiry } from "@/lib/inquiry-handler";

export const POST = (req: Request) => handleEnquiry(req, "vehicle-enquiry");
