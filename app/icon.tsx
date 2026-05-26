import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #10b981, #059669)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="2" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.95" />
          <rect x="9" y="2" width="5" height="5" rx="1.2" fill="white" opacity="0.40" />
          <rect x="2" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.40" />
          <rect x="9" y="9" width="5" height="5" rx="1.2" fill="white" opacity="0.95" />
        </svg>
      </div>
    ),
    { ...size },
  );
}
