"use client";
import React from "react";
import { useTranslation } from "@/lib/i18n/client-translations";

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  const sections = t("privacy.sections", { returnObjects: true }); // important for array of sections

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>{t("privacy.title")}</h1>
      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#2c3e50" }}>{section.heading}</h2>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default PrivacyPolicy;
