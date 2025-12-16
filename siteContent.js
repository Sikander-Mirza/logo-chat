// siteContent.js
import {
  pricingLogoData,
  pricingWebData,
  pricingIllustrationData,
  pricingEcommerceData,
  pricingSeoData,
  pricingBrandingData,
  pricingAnimationData,
  pricingAllData,
} from "./pricingContent.js";

export const siteContent = [];

// helper to push each package as a text chunk
function addPricingCategory(categoryName, packages) {
  packages.forEach((pkg) => {
    const text = `
Category: ${categoryName}
Package: ${pkg.packageName}
Price: ${pkg.currency}${pkg.price} (Old: ${pkg.currency}${pkg.oldPrice})
Features:
- ${pkg.features.join("\n- ")}
    `.trim();

    siteContent.push({ id: `${categoryName}-${pkg.packageName}`, text });
  });
}

addPricingCategory("Logo Design", pricingLogoData);
addPricingCategory("Web Solutions", pricingWebData);
addPricingCategory("Illustration", pricingIllustrationData);
addPricingCategory("E‑Commerce", pricingEcommerceData);
addPricingCategory("SEO Services", pricingSeoData);
addPricingCategory("Branding", pricingBrandingData);
addPricingCategory("Motion / Animation", pricingAnimationData);
addPricingCategory("All‑in‑One", pricingAllData);

// You can also add other non‑pricing content here:
siteContent.push({
  id: "about",
  text: `The Logo Wall Street LLC is a top logo design company offering custom logo design, web design & development, branding, motion graphics, SEO services, and more.`,
});
siteContent.push({
  id: "contact",
  text: `You can reach us at (307) 218-3240 or info@thelogowallstreet.com for project inquiries and custom quotes.`,
});