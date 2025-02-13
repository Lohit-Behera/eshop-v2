import { useState, forwardRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

const PasswordInput = forwardRef<
  HTMLInputElement,
  { placeholder: string; id?: string; className?: string }
>(({ placeholder, id, className, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const radius = 100; // change this to increase the rdaius of the hover effect
  const [visible, setVisible] = useState(false);

  let mouseX = useMotionValue(0);
  let mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: any) {
    let { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }
  return (
    <motion.div
      style={{
        background: useMotionTemplate`
            radial-gradient(
              ${
                visible ? radius + "px" : "0px"
              } circle at ${mouseX}px ${mouseY}px,
              var(--blue-500),
              transparent 80%
            )
          `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="p-[2px] rounded-lg transition duration-300 group/input"
    >
      <div
        className={cn(
          "relative flex h-10 w-full rounded-md border border-input bg-background shadow-sm transition-colors placeholder:text-foreground focus-within:ring-2 ring-ring ring-neutral-400 dark:ring-neutral-600",
          className
        )}
      >
        <Input
          className="h-auto bg-muted text-black dark:text-white border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0 w-full"
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          ref={ref}
          id={id}
          {...props}
        />
        <span
          onClick={() => setShowPassword(!showPassword)}
          className="px-1 py-1 cursor-pointer absolute inset-y-0 right-0 flex items-center"
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </span>
      </div>
    </motion.div>
  );
});

export default PasswordInput;
