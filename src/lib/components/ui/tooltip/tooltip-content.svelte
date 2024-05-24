<script lang="ts">
  import { Tooltip as TooltipPrimitive } from 'bits-ui';
  import { cn, flyAndScale } from '$lib/utils';

  type $$Props = TooltipPrimitive.ContentProps & {
    warning?: boolean;
  };

  let className: $$Props['class'] = undefined;
  export let sideOffset: $$Props['sideOffset'] = 4;
  export let transition: $$Props['transition'] = flyAndScale;
  export let transitionConfig: $$Props['transitionConfig'] = {
    y: 8,
    duration: 150
  };
  export { className as class };
</script>

<TooltipPrimitive.Content
  {transition}
  {transitionConfig}
  {sideOffset}
  class={cn(
    'z-50 rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
    className,
    {
      'border-[#fdf5d3] bg-[#fffcf0] text-[#dc7609] text-xs': $$props.warning
    }
  )}
  {...$$restProps}
>
  <slot />
  <TooltipPrimitive.Arrow
    class={cn('border-dark-10 rounded-[2px] border-l border-t', {
      'border-[#fdf5d3]': $$props.warning
    })}
  />
</TooltipPrimitive.Content>
