import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { API_URL } from "@/utils/telegram";

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  description: string;
  category: string;
  symptoms?: string[];
}

interface Category {
  id: number;
  name: string;
}

interface Symptom {
  id: number;
  name: string;
  relatedProducts: number[]; // Product IDs
}

const categories: Category[] = [
  { id: 1, name: "Pain Relief" },
  { id: 2, name: "Cold & Flu" },
  { id: 3, name: "Allergies" },
  { id: 4, name: "Digestive Health" },
];

const symptoms: Symptom[] = [
  { 
    id: 1, 
    name: "Headache", 
    relatedProducts: [1, 2] 
  },
  { 
    id: 2, 
    name: "Fever", 
    relatedProducts: [1, 3] 
  },
  // Add more symptoms
];

const products: Product[] = [
  // Pain Relief Category
  { 
    id: 1, 
    name: "Aspirin", 
    price: 9.99, 
    stock: 100, 
    description: "General pain reliever and fever reducer", 
    category: "Pain Relief",
    symptoms: ["Headache", "Fever", "Minor Pain"]
  },
  { 
    id: 2, 
    name: "Ibuprofen", 
    price: 12.99, 
    stock: 75, 
    description: "Anti-inflammatory pain reliever", 
    category: "Pain Relief",
    symptoms: ["Headache", "Joint Pain", "Inflammation"]
  },
  { 
    id: 3, 
    name: "Paracetamol Extra", 
    price: 8.99, 
    stock: 120, 
    description: "Fast-acting pain and fever relief", 
    category: "Pain Relief",
    symptoms: ["Headache", "Fever", "Body Pain"]
  },

  // Cold & Flu Category
  { 
    id: 4, 
    name: "NightTime Cold Relief", 
    price: 15.99, 
    stock: 50, 
    description: "Nighttime cold and flu symptom relief", 
    category: "Cold & Flu",
    symptoms: ["Cough", "Congestion", "Fever"]
  },
  { 
    id: 5, 
    name: "DayQuil Capsules", 
    price: 18.99, 
    stock: 60, 
    description: "Daytime cold and flu relief without drowsiness", 
    category: "Cold & Flu",
    symptoms: ["Cough", "Congestion", "Sore Throat"]
  },
  { 
    id: 6, 
    name: "Throat Lozenges", 
    price: 6.99, 
    stock: 150, 
    description: "Soothing relief for sore throat", 
    category: "Cold & Flu",
    symptoms: ["Sore Throat", "Cough"]
  },

  // Allergies Category
  { 
    id: 7, 
    name: "Antihistamine Tablets", 
    price: 14.99, 
    stock: 80, 
    description: "24-hour allergy relief", 
    category: "Allergies",
    symptoms: ["Allergies", "Hay Fever", "Itchy Eyes"]
  },
  { 
    id: 8, 
    name: "Nasal Spray", 
    price: 11.99, 
    stock: 45, 
    description: "Fast-acting allergy nasal relief", 
    category: "Allergies",
    symptoms: ["Nasal Congestion", "Allergies"]
  },
  { 
    id: 9, 
    name: "Eye Drops", 
    price: 8.99, 
    stock: 70, 
    description: "Allergy eye relief drops", 
    category: "Allergies",
    symptoms: ["Itchy Eyes", "Eye Irritation"]
  },

  // Digestive Health Category
  { 
    id: 10, 
    name: "Antacid Tablets", 
    price: 7.99, 
    stock: 90, 
    description: "Fast heartburn relief", 
    category: "Digestive Health",
    symptoms: ["Heartburn", "Indigestion"]
  },
  { 
    id: 11, 
    name: "Probiotics", 
    price: 24.99, 
    stock: 40, 
    description: "Daily digestive health support", 
    category: "Digestive Health",
    symptoms: ["Digestive Issues", "Bloating"]
  },
  { 
    id: 12, 
    name: "Anti-Diarrheal", 
    price: 10.99, 
    stock: 65, 
    description: "Fast-acting diarrhea relief", 
    category: "Digestive Health",
    symptoms: ["Diarrhea"]
  },
  { 
    id: 13, 
    name: "Fiber Supplement", 
    price: 19.99, 
    stock: 55, 
    description: "Daily fiber supplement for digestive health", 
    category: "Digestive Health",
    symptoms: ["Constipation", "Irregular Bowel Movements"]
  },

  // Additional Pain Relief Products
  { 
    id: 14, 
    name: "Muscle Rub Cream", 
    price: 13.99, 
    stock: 45, 
    description: "Topical pain relief for sore muscles", 
    category: "Pain Relief",
    symptoms: ["Muscle Pain", "Joint Pain"]
  },
  { 
    id: 15, 
    name: "Migraine Relief", 
    price: 16.99, 
    stock: 35, 
    description: "Specialized migraine pain relief", 
    category: "Pain Relief",
    symptoms: ["Migraine", "Severe Headache"]
  },

  // Additional Cold & Flu Products
  { 
    id: 16, 
    name: "Chest Rub", 
    price: 8.99, 
    stock: 70, 
    description: "Vapor rub for congestion relief", 
    category: "Cold & Flu",
    symptoms: ["Chest Congestion", "Cough"]
  },
  { 
    id: 17, 
    name: "Flu Defense Plus", 
    price: 21.99, 
    stock: 30, 
    description: "Complete flu symptom relief", 
    category: "Cold & Flu",
    symptoms: ["Flu", "Fever", "Body Aches"]
  },

  // Additional Allergy Products
  { 
    id: 18, 
    name: "Children's Allergy", 
    price: 13.99, 
    stock: 50, 
    description: "Child-friendly allergy relief", 
    category: "Allergies",
    symptoms: ["Children's Allergies", "Hay Fever"]
  },
  { 
    id: 19, 
    name: "Allergy Plus", 
    price: 19.99, 
    stock: 40, 
    description: "Maximum strength allergy relief", 
    category: "Allergies",
    symptoms: ["Severe Allergies", "Sinus Congestion"]
  },

  // Additional Digestive Product
  { 
    id: 20, 
    name: "Gas Relief", 
    price: 11.99, 
    stock: 85, 
    description: "Fast-acting gas and bloating relief", 
    category: "Digestive Health",
    symptoms: ["Gas", "Bloating"]
  }
];

interface ProductsPanelProps {
  selectedChatId: number | null;
  onMessageSent?: (message: string) => void;
}

interface ProductListProps {
  products: Product[];
  selectedChatId: number | null;
  onMessageSent?: (message: string) => void;
}

export const ProductsPanel = ({ selectedChatId, onMessageSent }: ProductsPanelProps) => {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedSymptom, setSelectedSymptom] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const getFilteredProducts = () => {
    if (selectedSymptom) {
      const symptom = symptoms.find(s => s.id === selectedSymptom);
      return products.filter(p => symptom?.relatedProducts.includes(p.id));
    }
    
    if (selectedCategory) {
      const category = categories.find(c => c.id === selectedCategory);
      return products.filter(p => p.category === category?.name);
    }

    return products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b">
        <h2 className="text-lg font-semibold mb-4">Product Catalog</h2>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        <Tabs defaultValue="products" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="products" className="flex-1">Products</TabsTrigger>
            <TabsTrigger value="symptoms" className="flex-1">Symptoms</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="mt-4">
            {!selectedCategory ? (
              <div className="grid gap-2">
                {categories.map(category => (
                  <Button
                    key={category.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="mb-2"
                  onClick={() => setSelectedCategory(null)}
                >
                  ← Back to Categories
                </Button>
                <ProductList 
                  products={getFilteredProducts()}
                  selectedChatId={selectedChatId}
                  onMessageSent={onMessageSent}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="symptoms" className="mt-4">
            {!selectedSymptom ? (
              <div className="grid gap-2">
                {symptoms.map(symptom => (
                  <Button
                    key={symptom.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setSelectedSymptom(symptom.id)}
                  >
                    {symptom.name}
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Button
                  variant="ghost"
                  className="mb-2"
                  onClick={() => setSelectedSymptom(null)}
                >
                  ← Back to Symptoms
                </Button>
                <ProductList 
                  products={getFilteredProducts()}
                  selectedChatId={selectedChatId}
                  onMessageSent={onMessageSent}
                />
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Separate component for product list
const ProductList = ({ products, selectedChatId, onMessageSent }: ProductListProps) => {
  const handleShareInfo = async (product: Product) => {
    if (!selectedChatId) {
      toast.error("Please select a chat first");
      return;
    }

    const productInfo = `
Product: ${product.name}
Price: $${product.price.toFixed(2)}
Description: ${product.description}
Stock: ${product.stock} units available
    `.trim();

    try {
      const response = await fetch(`${API_URL}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: selectedChatId,
          text: productInfo,
        }),
      });

      const data = await response.json();
      if (data.ok) {
        toast.success(`Shared ${product.name} information`);
        if (onMessageSent) {
          onMessageSent(productInfo);
        }
      } else {
        console.error("Telegram API error:", data);
        throw new Error(data.description || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sharing product info:', error);
      toast.error('Failed to share product information');
    }
  };

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="p-4 rounded-lg border hover:bg-accent/50 transition-colors"
        >
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            ${product.price.toFixed(2)}
          </p>
          <p className="text-sm text-muted-foreground">
            Stock: {product.stock}
          </p>
          <p className="text-sm mt-2">{product.description}</p>
          <div className="mt-3">
            <Button 
              size="sm"
              onClick={() => handleShareInfo(product)}
              className="w-full"
            >
              Share Info
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};