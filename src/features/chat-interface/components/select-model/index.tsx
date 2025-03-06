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
import useModels from "../../hooks/use-models";
import { usePreference } from "@/features/shared/providers/preference-provider";

interface Model {
  company: string;
  available: string[];
}

const SelectModel = () => {
  const { data: models, isPending, isError, error } = useModels();
  const currentModel = usePreference((state) => state.currentModel);
  const setModel = usePreference((state) => state.setModel);

  const handleValueChange = (value: string) => {
    const parsed = JSON.parse(value);
    setModel(parsed);
  };

  if (isError) {
    return <div>Error loading models: {error?.message}</div>;
  }

  if (isPending) {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={currentModel.model} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Loading...</SelectLabel>
            <SelectItem value="undefined">Loading models...</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }

  return (
    <Select
      value={
        currentModel.company === "default"
          ? undefined
          : JSON.stringify(currentModel)
      }
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder={currentModel.model} />
      </SelectTrigger>
      <SelectContent>
        {models?.map((model: Model, i: number) => (
          <SelectGroup key={i}>
            <SelectLabel>{model.company}</SelectLabel>
            {model.available.map((available: string, j: number) => (
              <SelectItem
                value={JSON.stringify({
                  company: model.company,
                  model: available,
                })}
                key={`${i}-${j}`}
              >
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
