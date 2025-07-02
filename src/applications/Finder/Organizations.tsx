import File from "@/components/File";
import organizationsData from "@/json/organizations.json";

export default function Organizations() {
  return (
    <div className="flex flex-wrap gap-6 p-4">
      {organizationsData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage={item.coverImage} />
      ))}
    </div>
  );
}
