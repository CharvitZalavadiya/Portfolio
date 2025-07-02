import File from "@/components/File";
import educationData from "@/json/education.json";

export default function Education() {
  return (
    <div className="flex flex-wrap gap-6">
      {educationData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage="/finder/textFile.png" />
      ))}
    </div>
  );
}
