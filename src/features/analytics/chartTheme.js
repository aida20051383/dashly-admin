// رنگ‌های برند؛ نمودارها با SVG رسم می‌شن و کلاس‌های Tailwind رو نمی‌خونن
export const PALETTE = {
  primary: "#7367f0",
  success: "#28c76f",
  warning: "#ff9f43",
  danger: "#ea5455",
  info: "#00cfe8",
};

// تولتیپ با متغیرهای CSS تم، پس توی دارک مود هم درست دیده می‌شه
export const tooltipProps = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 8,
    color: "var(--heading)",
    boxShadow: "none",
  },
  labelStyle: { color: "var(--heading)", fontWeight: 600 },
  itemStyle: { color: "var(--heading)" },
};
