"use client";

import Lottie from "lottie-react";
import loadingAnimation from "@/../public/loadingAnimationLottie.json";

export default function LoadingAnimation({
  width = 300,
  height = 300,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 min-h-84">
      <Lottie animationData={loadingAnimation} style={{ width, height }} />
    </div>
  );
}
