import Folder from "@/components/Folder";
import skillsData from "@/json/skills.json";

export default function Skills() {
  return (
    <div className="flex flex-wrap gap-6">
      {skillsData.map((category: any) => (
        <Folder
          key={category.name.name}
          name={category.name.name}
          coverImage={category.name.coverImage}
        />
      ))}
    </div>
  );
}
