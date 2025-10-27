"use client";
import React from "react";
import { useTranslation } from "@/lib/i18n/client-translations";

const Tos = () => {
  const { t } = useTranslation();
  const sections = t("tos.sections", { returnObjects: true });

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto", fontFamily: "Arial, sans-serif", lineHeight: "1.6" }}>
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>{t("tos.title")}</h1>
      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ color: "#2c3e50" }}>{section.heading}</h2>
          <p>{section.content}</p>
        </div>
      ))}
    </div>
  );
};

export default Tos;
