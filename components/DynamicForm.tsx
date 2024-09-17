import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, X } from "lucide-react";

interface Schema {
  [key: string]:
    | string
    | number
    | boolean
    | Schema
    | (string | number | boolean)[]
    | Schema[];
}

interface DynamicFormProps {
  schema: Schema;
  initialData?: Schema;
  onSubmit: (data: Schema) => void;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  schema,
  initialData,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<Schema>({});

  useEffect(() => {
    setFormData(initialData || {});
  }, [initialData]);

  const handleChange = (path: string, value: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const keys = path.split(".");
      let current = updatedData;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Schema;
      }

      current[keys[keys.length - 1]] = value;
      return updatedData;
    });
  };

  const renderForm = (schema: Schema, path: string = ""): JSX.Element[] => {
    return Object.entries(schema).map(([key, value]) => {
      const currentPath = path ? `${path}.${key}` : key;

      if (
        typeof value === "string" ||
        typeof value === "number" ||
        typeof value === "boolean"
      ) {
        return (
          <div key={currentPath} className="space-y-2">
            <Label htmlFor={currentPath}>{key}</Label>
            <Input
              id={currentPath}
              type={typeof value === "number" ? "number" : "text"}
              value={getNestedValue(formData, currentPath) || ""}
              onChange={(e) => handleChange(currentPath, e.target.value)}
            />
          </div>
        );
      } else if (Array.isArray(value)) {
        return renderArrayField(key, value, currentPath);
      } else {
        return (
          <Card key={currentPath} className="mt-4">
            <CardHeader>
              <CardTitle>{key}</CardTitle>
            </CardHeader>
            <CardContent>
              {renderForm(value as Schema, currentPath)}
            </CardContent>
          </Card>
        );
      }
    });
  };

  const renderArrayField = (key: string, value: any[], currentPath: string) => {
    const arrayValue = (getNestedValue(formData, currentPath) as any[]) || [];

    return (
      <Card key={currentPath} className="mt-4">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            {key}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => handleAddArrayItem(currentPath, value[0])}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add {key}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {arrayValue.map((item, index) => (
            <Card key={`${currentPath}.${index}`} className="relative">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemoveArrayItem(currentPath, index)}
              >
                <X className="h-4 w-4" />
              </Button>
              <CardContent className="pt-8">
                {typeof item !== "object" ? (
                  <Input
                    type="text"
                    value={item || ""}
                    onChange={(e) =>
                      handleArrayItemChange(currentPath, index, e.target.value)
                    }
                  />
                ) : (
                  <div className="space-y-4">
                    {renderForm(value[0] as Schema, `${currentPath}.${index}`)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    );
  };
  const getNestedValue = (obj: any, path: string) => {
    return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
  };

  const handleArrayItemChange = (path: string, index: number, value: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const arrayPath = path.split(".");
      let current = updatedData;

      for (let i = 0; i < arrayPath.length - 1; i++) {
        if (!current[arrayPath[i]]) {
          current[arrayPath[i]] = {};
        }
        current = current[arrayPath[i]] as Schema;
      }

      if (!Array.isArray(current[arrayPath[arrayPath.length - 1]])) {
        current[arrayPath[arrayPath.length - 1]] = [];
      }

      (current[arrayPath[arrayPath.length - 1]] as any[])[index] = value;
      return updatedData;
    });
  };

  const handleAddArrayItem = (path: string, schemaItem: any) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const arrayPath = path.split(".");
      let current = updatedData;

      for (let i = 0; i < arrayPath.length - 1; i++) {
        if (!current[arrayPath[i]]) {
          current[arrayPath[i]] = {};
        }
        current = current[arrayPath[i]] as Schema;
      }

      if (!Array.isArray(current[arrayPath[arrayPath.length - 1]])) {
        current[arrayPath[arrayPath.length - 1]] = [];
      }

      const newItem = typeof schemaItem === "object" ? {} : "";
      (current[arrayPath[arrayPath.length - 1]] as any[]).push(newItem);
      return updatedData;
    });
  };

  const handleRemoveArrayItem = (path: string, index: number) => {
    setFormData((prevData) => {
      const updatedData = { ...prevData };
      const arrayPath = path.split(".");
      let current = updatedData;

      for (let i = 0; i < arrayPath.length - 1; i++) {
        if (!current[arrayPath[i]]) {
          current[arrayPath[i]] = {};
        }
        current = current[arrayPath[i]] as Schema;
      }

      if (Array.isArray(current[arrayPath[arrayPath.length - 1]])) {
        (current[arrayPath[arrayPath.length - 1]] as any[]).splice(index, 1);
      }

      return updatedData;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Dynamic Form</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-6">{renderForm(schema)}</div>
          </ScrollArea>
        </form>
      </CardContent>
      <CardFooter>
        <Button className="w-full" type="submit" onClick={handleSubmit}>
          Preview
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DynamicForm;
