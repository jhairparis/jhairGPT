"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/features/shared/components/ui/select";
import useModels from "../../hooks/useModels";
import React, { useState } from "react";

interface Model {
  company: string;
  available: string[];
}

const SelectModel = () => {
  const { data: models, isPending, isError, error } = useModels();
  const [selectedModel, setSelectedModel] = useState<string>("");

  const handleValueChange = (value: string) => {
    setSelectedModel(value);
  };

  if (isError) {
    return <div>Error loading models: {error?.message}</div>;
  }

  if (isPending) {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select your AI" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="undefined">Loading models...</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select value={selectedModel} onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select your AI" />
      </SelectTrigger>
      <SelectContent>
        {models?.map((model: Model, i: number) => (
          <SelectGroup key={i}>
            <SelectLabel>{model.company}</SelectLabel>
            {model.available.map((available: string, j: number) => (
              <SelectItem value={available} key={`${i}-${j}`}>
                {available}
              </SelectItem>
            ))}
            {i < models.length - 1 && <SelectSeparator />}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  );
};

export default SelectModel;
