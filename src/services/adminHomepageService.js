import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";

/**
 * Fetch homepage configuration document.
 */
export const getHomepageConfigAdmin = async () => {
  try {
    const docRef = doc(db, "homepage", "config");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    // Default configuration if missing
    return {
      featuredProductIds: [],
      heroProductId: null,
      bannerText: "100% Pure, Organic & Lab-Tested Forest Honey",
      bannerImage: "/images/hero-bg.png",
      promotionalText: "Raw, unprocessed honey sourced from pristine landscapes. No additives. No shortcuts. Just purity.",
      updatedAt: null,
    };
  } catch (error) {
    console.error("Error fetching homepage config:", error);
    return {
      featuredProductIds: [],
      heroProductId: null,
      bannerText: "",
      promotionalText: "",
    };
  }
};

/**
 * Save updated homepage configuration.
 */
export const updateHomepageConfigAdmin = async (configData, adminUid = "admin") => {
  try {
    const docRef = doc(db, "homepage", "config");
    const payload = {
      featuredProductIds: configData.featuredProductIds || [],
      heroProductId: configData.heroProductId || null,
      bannerText: configData.bannerText?.trim() || "",
      bannerImage: configData.bannerImage || null,
      promotionalText: configData.promotionalText?.trim() || "",
      updatedAt: serverTimestamp(),
      updatedBy: adminUid,
    };

    await setDoc(docRef, payload, { merge: true });
    return payload;
  } catch (error) {
    console.error("Error updating homepage config:", error);
    throw new Error("Failed to save homepage settings: " + error.message);
  }
};
