import { generateDefaultSeo } from "next-seo/pages";
import seoConfig from "../../next-seo.config";

export default function Head() {
  return <>{generateDefaultSeo(seoConfig)}</>;
}

