import { TranslationTool } from "@/components/TranslationTool";
import { ThemeToggle } from "@/components/ThemeToggle";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 relative">
      <ThemeToggle />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-3">
          FluentFlow
          </h1>
          <p className="text-lg max-w-2xl mx-auto">
          Smooth and intuitive translations to keep your conversations flowing.
          </p>
        </div>
        <TranslationTool />
      </div>
    </div>
  );
};

export default Index;
