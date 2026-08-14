import Spinner from "@/components/ui/Spinner";

// Marshrut chunk'i yuklanayotganda ko'rsatiladi. Balandligi sahifa
// balandligiga yaqin olingan — aks holda yuklanish paytida footer
// yuqoriga sakrab, keyin joyiga tushardi.
export default function PageLoader() {
  return (
    <div
      style={{ minHeight: "calc(100vh - 200px)" }}
      className="flex items-center justify-center"
    >
      <Spinner size="xl" color="dark" />
    </div>
  );
}
