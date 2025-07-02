import File from "@/components/File";
import projectsData from "@/json/projects.json";

export default function Projects() {
  return (
    <div className="flex flex-wrap gap-6">
      {projectsData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage={item.coverImage} />
      ))}
    </div>
  );
}
