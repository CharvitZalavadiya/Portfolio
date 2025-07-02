import File from "@/components/File";
import participationsData from "@/json/participations.json";

export default function Participations() {
  return (
    <div className="flex flex-wrap gap-6 p-4">
      {participationsData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage={item.coverImage} />
      ))}
    </div>
  );
}
