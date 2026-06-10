"use client";

import * as React from "react";
import { Check, Filter, ArrowUp, ArrowDown, ArrowUpDown, Settings2, ListFilter, ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export type FilterConditionType = 
  | 'none' 
  | 'contains' 
  | 'not_contains' 
  | 'starts_with' 
  | 'ends_with' 
  | 'equals'
  | 'greater_than'
  | 'less_than'
  | 'between';

export interface FilterCondition {
  type: FilterConditionType;
  value: string;
  value2?: string;
}

export interface DataTableFilterProps {
  title: string;
  options: {
    label: string;
    value: string;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
  selectedValues: string[];
  onSelectedChange: (values: string[]) => void;
  condition?: FilterCondition;
  onConditionChange?: (condition: FilterCondition) => void;
  filterType?: 'text' | 'number';
  sortDirection?: "asc" | "desc" | null;
  onSortChange?: (direction: "asc" | "desc" | null) => void;
}

export function DataTableFilter({
  title,
  options,
  selectedValues,
  onSelectedChange,
  condition,
  onConditionChange,
  filterType = 'text',
  sortDirection,
  onSortChange,
}: DataTableFilterProps) {
  const [open, setOpen] = React.useState(false);
  
  // Temporary states
  const [tempSelectedValues, setTempSelectedValues] = React.useState<string[]>([]);
  const [tempCondition, setTempCondition] = React.useState<FilterCondition>({ type: 'none', value: '' });

  // Sync temporary state when opening
  React.useEffect(() => {
    if (open) {
      setTempSelectedValues(selectedValues);
      setTempCondition(condition || { type: 'none', value: '' });
    }
  }, [open, selectedValues, condition]);

  const toggleTempOption = (value: string) => {
    const isSelected = tempSelectedValues.includes(value);
    if (isSelected) {
      setTempSelectedValues(tempSelectedValues.filter((v) => v !== value));
    } else {
      setTempSelectedValues([...tempSelectedValues, value]);
    }
  };

  const handleApply = () => {
    onSelectedChange(tempSelectedValues);
    if (onConditionChange) {
      onConditionChange(tempCondition);
    }
    setOpen(false);
  };

  const isFilterActive = selectedValues.length > 0 || (condition && condition.type !== 'none' && condition.value !== '');

  return (
    <div className="flex items-center gap-1 group">
      <span>{title}</span>
      
      {/* Indicador de ordenação fixo */}
      {sortDirection === "asc" && <ArrowUp className="h-3 w-3 text-muted-foreground ml-1" />}
      {sortDirection === "desc" && <ArrowDown className="h-3 w-3 text-muted-foreground ml-1" />}

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-6 w-6 ml-1 transition-opacity",
              isFilterActive || open ? "opacity-100 bg-accent/50" : "opacity-0 group-hover:opacity-100 hover:bg-accent"
            )}
          >
            {isFilterActive ? (
              <div className="relative flex items-center justify-center w-full h-full">
                <Filter className="h-3 w-3 text-primary" />
                {selectedValues.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
                    {selectedValues.length}
                  </span>
                )}
              </div>
            ) : (
              <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
        <div className="flex flex-col">
          {/* Ordenação */}
          {onSortChange && (
            <div className="flex flex-col p-1 border-b">
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("justify-start font-normal h-8", sortDirection === 'asc' && "bg-muted")}
                onClick={() => { onSortChange('asc'); setOpen(false); }}
              >
                <ArrowUp className="mr-2 h-4 w-4 text-muted-foreground" /> 
                Classificar A a Z
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className={cn("justify-start font-normal h-8", sortDirection === 'desc' && "bg-muted")}
                onClick={() => { onSortChange('desc'); setOpen(false); }}
              >
                <ArrowDown className="mr-2 h-4 w-4 text-muted-foreground" /> 
                Classificar Z a A
              </Button>
            </div>
          )}

          <Accordion type="multiple" defaultValue={["values"]} className="w-full">
            {/* Filtrar por Condição */}
            {onConditionChange && (
              <AccordionItem value="condition" className="border-b-0">
                <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline font-medium">
                  <div className="flex items-center gap-2">
                    <Settings2 className="h-4 w-4 text-muted-foreground" />
                    Filtrar por condição
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="flex flex-col gap-2">
                    <Select 
                      value={tempCondition.type} 
                      onValueChange={(val) => setTempCondition({...tempCondition, type: val as FilterConditionType})}
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Nenhuma</SelectItem>
                        {filterType === 'number' ? (
                          <>
                            <SelectItem value="equals">É exatamente</SelectItem>
                            <SelectItem value="greater_than">Maior que</SelectItem>
                            <SelectItem value="less_than">Menor que</SelectItem>
                            <SelectItem value="between">Entre</SelectItem>
                          </>
                        ) : (
                          <>
                            <SelectItem value="contains">Contém</SelectItem>
                            <SelectItem value="not_contains">Não contém</SelectItem>
                            <SelectItem value="starts_with">Começa com</SelectItem>
                            <SelectItem value="ends_with">Termina com</SelectItem>
                            <SelectItem value="equals">É exatamente</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                    
                    {tempCondition.type !== 'none' && tempCondition.type !== 'between' && (
                      <Input 
                        placeholder="Valor..." 
                        className="h-8 text-sm"
                        value={tempCondition.value}
                        onChange={(e) => setTempCondition({...tempCondition, value: e.target.value})}
                      />
                    )}
                    
                    {tempCondition.type === 'between' && (
                      <div className="flex items-center gap-2">
                        <Input 
                          placeholder="Mínimo" 
                          className="h-8 text-sm"
                          value={tempCondition.value}
                          onChange={(e) => setTempCondition({...tempCondition, value: e.target.value})}
                        />
                        <span className="text-xs text-muted-foreground">e</span>
                        <Input 
                          placeholder="Máximo" 
                          className="h-8 text-sm"
                          value={tempCondition.value2 || ''}
                          onChange={(e) => setTempCondition({...tempCondition, value2: e.target.value})}
                        />
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Filtrar por Valores */}
            <AccordionItem value="values" className="border-b-0 border-t">
              <AccordionTrigger className="px-3 py-2 text-sm hover:no-underline font-medium">
                <div className="flex items-center gap-2">
                  <ListChecks className="h-4 w-4 text-muted-foreground" />
                  Filtrar por valores
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-0">
                <div className="flex px-3 pb-2 pt-1 text-sm text-primary">
                  <button 
                    type="button" 
                    onClick={() => setTempSelectedValues(options.map(o => o.value))} 
                    className="hover:underline"
                  >
                    Selecionar tudo
                  </button>
                  <span className="mx-2 text-muted-foreground">-</span>
                  <button 
                    type="button" 
                    onClick={() => setTempSelectedValues([])} 
                    className="hover:underline"
                  >
                    Limpar
                  </button>
                </div>
                <Command className="border-t">
                  <CommandInput placeholder="Buscar valores..." className="h-9 border-none focus:ring-0" />
                  <CommandList>
                    <CommandEmpty>Nenhum resultado.</CommandEmpty>
                    <ScrollArea className="h-[150px]">
                      <CommandGroup>
                        {options.map((option) => {
                          const isSelected = tempSelectedValues.includes(option.value);
                          return (
                            <CommandItem
                              key={option.value}
                              onSelect={() => toggleTempOption(option.value)}
                            >
                              <div
                                className={cn(
                                  "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                  isSelected
                                    ? "bg-primary text-primary-foreground"
                                    : "opacity-50 [&_svg]:invisible"
                                )}
                              >
                                <Check className={cn("h-4 w-4")} />
                              </div>
                              {option.icon && (
                                <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                              )}
                              <span className="truncate">{option.label}</span>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </ScrollArea>
                  </CommandList>
                </Command>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Ações (Rodapé) */}
          <div className="flex justify-end p-2 border-t gap-2 bg-muted/20">
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button variant="default" size="sm" onClick={handleApply}>
              OK
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
    </div>
  );
}
