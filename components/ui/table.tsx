import * as React from "react";

// Table — shadcn/ui style, minimal, responsive-ready

export const Table = React.forwardRef<
  HTMLTableElement,
  React.TableHTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table
    ref={ref}
    className={
      "w-full border-collapse text-sm [&_th]:text-left [&_thead]:bg-muted [&_td]:p-3 [&_th]:p-3 [&_tbody_tr]:border-b [&_tbody_tr:last-child]:border-0 [&_td]:align-middle [&_th]:align-middle " +
      (className || "")
    }
    {...props}
  />
));
Table.displayName = "Table";

export const Thead = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead
    ref={ref}
    className={"bg-muted/60 " + (className || "")}
    {...props}
  />
));
Thead.displayName = "Thead";

export const Tbody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={className}
    {...props}
  />
));
Tbody.displayName = "Tbody";

export const Tr = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={(className || "")}
    {...props}
  />
));
Tr.displayName = "Tr";

export const Th = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={"font-semibold text-muted-foreground/80 uppercase text-xs tracking-wide " + (className || "")}
    {...props}
  />
));
Th.displayName = "Th";

export const Td = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={className}
    {...props}
  />
));
Td.displayName = "Td";