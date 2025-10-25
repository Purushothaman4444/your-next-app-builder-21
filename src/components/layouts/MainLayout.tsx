import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BottomTabNavigation } from "@/components/BottomTabNavigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomTabNavigation />
    </div>
  );
};
