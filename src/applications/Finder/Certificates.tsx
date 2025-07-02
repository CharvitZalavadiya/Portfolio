import File from "@/components/File";
import certificatesData from "@/json/certificates.json";

export default function Certificates() {
  return (
    <div className="flex flex-wrap gap-6 p-4">
      {certificatesData.map((item: any) => (
        <File key={item.name} name={item.name} coverImage={item.coverImage} />
      ))}
    </div>
  );
}
