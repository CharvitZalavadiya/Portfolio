import File from "@/components/File";
import experienceData from "@/json/experience.json";

export default function Experience() {
  return (
    <div className="flex flex-wrap gap-6">
      {experienceData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage={item.coverImage} />
      ))}
    </div>
  );
}
