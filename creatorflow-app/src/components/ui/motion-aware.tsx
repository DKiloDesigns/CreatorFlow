import * as React from 'react';
import { useMotionReduction, getMotionAwareStyles, getMotionAwareClassName } from '@/lib/motion-reduction';

interface MotionAwareProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  reducedMotionClassName?: string;
  reducedMotionStyle?: React.CSSProperties;
  disableAnimations?: boolean;
  disableTransitions?: boolean;
  disableTransforms?: boolean;
  disableScrollBehavior?: boolean;
}

export function MotionAware({
  children,
  className = '',
  style = {},
  reducedMotionClassName = '',
  reducedMotionStyle = {},
  disableAnimations = false,
  disableTransitions = false,
  disableTransforms = false,
  disableScrollBehavior = false,
}: MotionAwareProps) {
  const motionConfig = useMotionReduction();

  const finalClassName = getMotionAwareClassName(className, reducedMotionClassName);
  const finalStyle = getMotionAwareStyles(style, reducedMotionStyle);

  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (ref.current && motionConfig.enabled) {
      motionConfig.applyMotionReduction(ref.current, {
        animations: disableAnimations,
        transitions: disableTransitions,
        transforms: disableTransforms,
        scrollBehavior: disableScrollBehavior,
      });
    }
  }, [motionConfig.enabled, disableAnimations, disableTransitions, disableTransforms, disableScrollBehavior, motionConfig]);

  return (
    <div ref={ref} className={finalClassName} style={finalStyle}>
      {children}
    </div>
  );
}

interface MotionAwareButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  reducedMotionClassName?: string;
}

export function MotionAwareButton({
  children,
  className = '',
  reducedMotionClassName = 'motion-reduce-transitions',
  ...props
}: MotionAwareButtonProps) {
  const _motionConfig = useMotionReduction();
  const finalClassName = getMotionAwareClassName(className, reducedMotionClassName);

  return (
    <button className={finalClassName} {...props}>
      {children}
    </button>
  );
}

interface MotionAwareCardProps {
  children: React.ReactNode;
  className?: string;
  reducedMotionClassName?: string;
}

export function MotionAwareCard({
  children,
  className = '',
  reducedMotionClassName = 'motion-reduce-transitions',
}: MotionAwareCardProps) {
  const _motionConfig = useMotionReduction();
  const finalClassName = getMotionAwareClassName(className, reducedMotionClassName);

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
}

interface MotionAwareAnimationProps {
  children: React.ReactNode;
  className?: string;
  animationClassName?: string;
  reducedMotionClassName?: string;
}

export function MotionAwareAnimation({
  children,
  className = '',
  animationClassName = '',
  reducedMotionClassName = 'motion-reduce-animations',
}: MotionAwareAnimationProps) {
  const _motionConfig = useMotionReduction();
  const finalClassName = getMotionAwareClassName(
    `${className} ${animationClassName}`.trim(),
    reducedMotionClassName
  );

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
}
