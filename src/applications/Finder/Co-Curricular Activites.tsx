import File from "@/components/File";
import activitiesData from "@/json/co-curricular-activities.json";

export default function CoCurricularActivites() {
  return (
    <div className="flex flex-wrap gap-6 p-4">
      {activitiesData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage={item.coverImage} />
      ))}
    </div>
  );
}
