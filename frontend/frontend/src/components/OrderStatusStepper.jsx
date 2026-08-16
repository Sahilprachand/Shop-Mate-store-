import { CheckIcon, XIcon } from "lucide-react";
import { ORDER_STATUS_STEPS } from "../constants";

function OrderStatusStepper({ status }) {
  if (status === "Cancelled") {
    return (
      <div className="flex items-center gap-2 text-error">
        <XIcon className="size-5" />
        <span className="font-medium">This order was cancelled</span>
      </div>
    );
  }

  const currentIndex = ORDER_STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center w-full">
      {ORDER_STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIndex;
        const isLast = i === ORDER_STATUS_STEPS.length - 1;

        return (
          <div key={step} className={`flex items-center ${isLast ? "" : "flex-1"}`}>
            <div className="flex flex-col items-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center border-2 shrink-0 transition-colors ${
                  isDone
                    ? "bg-neutral border-neutral text-neutral-content"
                    : "border-base-content/20 text-base-content/30"
                }`}
              >
                {isDone ? <CheckIcon className="size-4" /> : <span className="text-xs">{i + 1}</span>}
              </div>
              <span
                className={`text-[10px] uppercase tracking-wide mt-2 text-center max-w-[70px] ${
                  isDone ? "text-base-content" : "text-base-content/40"
                }`}
              >
                {step}
              </span>
            </div>
            {!isLast && (
              <div
                className={`h-[2px] flex-1 mx-1 mb-5 transition-colors ${
                  i < currentIndex ? "bg-neutral" : "bg-base-content/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default OrderStatusStepper;
