"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Footer } from "@/components/Footer";
import { MapPin, Leaf, ChefHat, Sparkles, X } from "lucide-react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const spices = [
  {
    id: 1,
    name: "Red Chilli",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191267/Gemini_Generated_Image_bsizjbbsizjbbsiz_flvxua.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191269/Gemini_Generated_Image_2silau2silau2sil_t3udnf.png",
    ],
    origin: "Native to Central and South America, now widely cultivated in India, particularly in Andhra Pradesh, Karnataka, and Gujarat",
    biological: "Capsicum annuum - A member of the Solanaceae family. Contains capsaicin, the compound responsible for its heat, measured in Scoville Heat Units (SHU)",
    usage: "Essential in Indian curries, marinades, and spice blends. Whole chillies are used for tempering, while powder adds heat and color to dishes. Key ingredient in garam masala and curry powders",
    characteristics: "Vibrant red color, intense heat ranging from mild to extremely hot, earthy and slightly smoky flavor. Rich in Vitamin C and antioxidants. Enhances metabolism and adds depth to dishes"
  },
  {
    id: 2,
    name: "Turmeric",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191266/71HwG8k8jYL._SL1226__ue49ws.jpg",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191271/Gemini_Generated_Image_ohh49fohh49fohh4_omrkrh.png",
    ],
    origin: "Native to Southeast Asia, primarily cultivated in India (Tamil Nadu, Maharashtra, West Bengal), China, and Indonesia. India produces 80% of the world's turmeric",
    biological: "Curcuma longa - A rhizomatous herbaceous perennial plant belonging to the ginger family, Zingiberaceae. Contains curcumin, a powerful bioactive compound",
    usage: "The golden spice of India, used in curries, rice dishes, and beverages like golden milk. Essential in spice blends, pickles, and as a natural food coloring. Used in Ayurvedic medicine for centuries",
    characteristics: "Bright golden-yellow color, warm and slightly bitter taste with earthy undertones. Anti-inflammatory and antioxidant properties. Known as 'Indian saffron' for its vibrant hue"
  },
  {
    id: 3,
    name: "Cumin",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191268/Gemini_Generated_Image_6obi6e6obi6e6obi_stsbfx.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191274/Gemini_Generated_Image_ob81w5ob81w5ob81_k3yag5.png",
    ],
    origin: "Originated in the Mediterranean and Middle East, now extensively grown in India (Gujarat, Rajasthan), Iran, and Turkey. India is the largest producer",
    biological: "Cuminum cyminum - An annual flowering plant in the Apiaceae family. Small, elongated seeds with distinctive ridges and a warm, earthy aroma",
    usage: "Fundamental in Indian, Middle Eastern, and Mexican cuisines. Whole seeds are used for tempering (tadka), while ground cumin is essential in spice blends, curries, and marinades",
    characteristics: "Warm, earthy, and slightly bitter flavor with a nutty undertone. Rich in iron and antioxidants. Aids digestion and adds depth to savory dishes. Distinctive aroma when toasted"
  },
  {
    id: 4,
    name: "Coriander",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191269/Gemini_Generated_Image_bvldksbvldksbvld_ftsaws.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191267/carinder_powder_snavif.png",
    ],
    origin: "Native to regions spanning from Southern Europe to North Africa and Southwest Asia. Widely cultivated in India (Rajasthan, Madhya Pradesh), Morocco, and Eastern Europe",
    biological: "Coriandrum sativum - An annual herb in the Apiaceae family. Both the seeds (coriander) and leaves (cilantro) are used, though they have distinctly different flavors",
    usage: "Whole seeds are used in pickling, spice blends, and tempering. Ground coriander is a base spice in most Indian curries and masalas. Fresh leaves (cilantro) are used as garnish",
    characteristics: "Mild, sweet, and citrusy flavor with hints of sage. Rich in dietary fiber and antioxidants. Helps reduce inflammation and supports digestive health. Essential in garam masala"
  },
  {
    id: 5,
    name: "Dry Ginger",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191270/Gemini_Generated_Image_jpe0g2jpe0g2jpe0_erbbsc.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191269/Gemini_Generated_Image_59c5u859c5u859c5_i4jyma.png",
    ],
    origin: "Originated in Southeast Asia, now cultivated in India (Kerala, Karnataka), China, Nigeria, and Jamaica. India is one of the largest producers",
    biological: "Zingiber officinale - A flowering plant whose rhizome (root) is used as a spice. Contains gingerol, the main bioactive compound responsible for its medicinal properties",
    usage: "Used in spice blends, teas, and traditional medicine. Whole dried ginger (sonth) is used in Ayurvedic preparations, while powder is essential in garam masala and baking",
    characteristics: "Warm, pungent, and slightly sweet flavor with a spicy kick. Powerful anti-inflammatory and digestive properties. Helps with nausea, colds, and circulation. More intense than fresh ginger"
  },
  {
    id: 6,
    name: "Green Cardamom",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191274/Gemini_Generated_Image_vbztxqvbztxqvbzt_lnqjzt.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191277/green_cardemon_powder_v4c6hz.png",
    ],
    origin: "Native to the Western Ghats of Southern India. Primarily grown in Kerala, Karnataka, and Tamil Nadu. Known as the 'Queen of Spices'",
    biological: "Elettaria cardamomum - A perennial plant in the Zingiberaceae family. The seeds are contained in small, green pods with a distinctive triangular cross-section",
    usage: "Used in both sweet and savory dishes. Essential in garam masala, biryanis, and desserts. Whole pods are used in tea (chai) and rice dishes. Powder is used in baking and spice blends",
    characteristics: "Intensely aromatic with a complex flavor profile - sweet, floral, and slightly minty with hints of eucalyptus. One of the most expensive spices. Aids digestion and freshens breath"
  },
  {
    id: 7,
    name: "Star Anise",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191274/Gemini_Generated_Image_c5opn4c5opn4c5op_ipcxcn.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191277/star_arise_powder_mxgkmx.png",
    ],
    origin: "Native to Northeast Vietnam and Southwest China. Also cultivated in India, Japan, and other parts of Asia. The star-shaped pods are harvested before ripening",
    biological: "Illicium verum - An evergreen tree in the Schisandraceae family. The star-shaped fruit contains seeds in each of its 6-8 points, resembling a star",
    usage: "Used in Chinese five-spice powder, garam masala, and biryanis. Whole stars are used in soups, stews, and teas. Powder is used in baking and spice blends",
    characteristics: "Strong, sweet, and licorice-like flavor with a warm, spicy undertone. Contains anethole, the same compound found in anise. Used in traditional medicine for respiratory health"
  },
  {
    id: 8,
    name: "Black Pepper",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191274/Gemini_Generated_Image_rr6ydvrr6ydvrr6y_cpukdy.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191277/pepper_powder_lwoivr.png",
    ],
    origin: "Native to the Malabar Coast of India (Kerala). Known as the 'King of Spices'. Also grown in Vietnam, Brazil, and Indonesia",
    biological: "Piper nigrum - A flowering vine in the Piperaceae family. The berries are harvested at different stages - green (unripe), black (dried unripe), white (ripe with skin removed)",
    usage: "Universal seasoning used in virtually every cuisine. Whole peppercorns are used in tempering and pickling. Ground pepper is a table spice and essential in spice blends",
    characteristics: "Sharp, pungent, and slightly woody flavor with a warm heat. Contains piperine, which enhances nutrient absorption. Rich in antioxidants. Adds depth and complexity to dishes"
  },
  {
    id: 9,
    name: "Cloves",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191273/Gemini_Generated_Image_v0dc8gv0dc8gv0dc_neogzw.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191268/cloves_powder_frqyev.png",
    ],
    origin: "Native to the Maluku Islands (Spice Islands) of Indonesia. Now cultivated in India (Kerala, Tamil Nadu), Madagascar, Zanzibar, and Sri Lanka",
    biological: "Syzygium aromaticum - The dried flower buds of an evergreen tree in the Myrtaceae family. The nail-shaped buds are harvested before they open",
    usage: "Used in garam masala, biryanis, and pickles. Whole cloves are used in rice dishes and for flavoring. Powder is used in spice blends and baking. Essential in chai masala",
    characteristics: "Intensely aromatic with a sweet, warm, and slightly bitter flavor. Contains eugenol, which has antiseptic and analgesic properties. Used in traditional medicine for dental health"
  },
  {
    id: 10,
    name: "Fenugreek",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191277/Gemini_Generated_Image_wwpe13wwpe13wwpe_dun3lf.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191268/fenugreek_powder_dgcrko.png",
    ],
    origin: "Native to the Mediterranean region and Western Asia. Extensively cultivated in India (Rajasthan, Gujarat), Egypt, and Morocco",
    biological: "Trigonella foenum-graecum - An annual plant in the Fabaceae family. Both the seeds and leaves (methi) are used. The seeds are small, hard, and angular",
    usage: "Seeds are used in spice blends, pickles, and curry pastes. Essential in Bengali and South Indian cuisines. Fresh leaves are used as a vegetable. Seeds are sprouted for salads",
    characteristics: "Bitter, nutty flavor with a distinctive maple-like aroma when cooked. Rich in fiber, protein, and iron. Known for its blood sugar regulation properties. Adds depth to vegetarian dishes"
  },
  {
    id: 11,
    name: "Cinnamon/Cassia",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191276/Gemini_Generated_Image_yynws9yynws9yynw_tpwjtj.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191267/cinnamon_powder_zip7yf.png",
    ],
    origin: "Ceylon cinnamon (true cinnamon) is native to Sri Lanka. Cassia cinnamon is native to China and Southeast Asia. Both are cultivated in India, Vietnam, and Indonesia",
    biological: "Cinnamomum verum (Ceylon) or Cinnamomum cassia - Evergreen trees in the Lauraceae family. The inner bark is harvested and dried into quills (sticks) or ground into powder",
    usage: "Used in sweet and savory dishes, spice blends, and beverages. Whole sticks are used in rice dishes, teas, and mulled wines. Powder is used in baking, desserts, and garam masala",
    characteristics: "Sweet, warm, and woody flavor with a delicate aroma (Ceylon) or stronger, more pungent taste (Cassia). Contains cinnamaldehyde. Helps regulate blood sugar and has anti-inflammatory properties"
  },
  {
    id: 12,
    name: "Nutmeg",
    forms: ["Whole", "Powder"],
    images: [
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191274/Gemini_Generated_Image_obsjvsobsjvsobsj_zgyhxm.png",
      "https://res.cloudinary.com/dzle7cpta/image/upload/v1767191276/nutmeg_powder_fgzebd.png",
    ],
    origin: "Native to the Banda Islands (Spice Islands) of Indonesia. Also cultivated in India (Kerala), Sri Lanka, Grenada, and the Caribbean",
    biological: "Myristica fragrans - An evergreen tree that produces both nutmeg (the seed) and mace (the red aril covering the seed). Both are used as separate spices",
    usage: "Used in sweet dishes, spice blends, and beverages. Whole nutmeg is grated fresh for best flavor. Powder is used in baking, garam masala, and desserts. Essential in chai masala",
    characteristics: "Warm, sweet, and slightly nutty flavor with a hint of pine. Rich in essential oils. Used in small quantities due to its intense flavor. Has sedative properties and aids digestion"
  }
];

export default function KnowYourSpices() {
  const [selectedSpice, setSelectedSpice] = useState<typeof spices[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const handleKnowMore = (spice: typeof spices[0]) => {
    setSelectedSpice(spice);
    setIsDialogOpen(true);
  };

  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <div className="grain-overlay" />

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6 container mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <p className="font-semibold text-xs uppercase tracking-widest text-accent mb-4">
            Knowledge & Heritage
          </p>
          <h1 className="font-serif text-6xl md:text-7xl leading-tight mb-6 text-primary-foreground">
            Know Your <span className="italic text-accent">Spices</span>
          </h1>
          <p className="font-sans text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the rich heritage, origins, and characteristics of our premium spice collection. Each spice tells a story of tradition, flavor, and culinary excellence.
          </p>
        </motion.div>
      </section>

      {/* Spices Grid */}
      <section className="pb-32 px-6 container mx-auto max-w-6xl">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {spices.map((spice, index) => (
            <motion.div
              key={spice.id}
              variants={itemVariants}
              onClick={() => handleKnowMore(spice)}
              className="group relative border border-primary/10 bg-white overflow-hidden hover:shadow-2xl transition-all duration-500 cursor-pointer rounded-lg"
              whileHover={{ y: -8, scale: 1.02 }}
              style={{
                background: index % 2 === 0 
                  ? 'linear-gradient(to bottom, #F9F7F2 0%, #FFFFFF 100%)' 
                  : 'linear-gradient(to bottom, #FFFFFF 0%, #F9F7F2 100%)'
              }}
            >
              {/* Image Container with Overlay */}
              <div className="relative h-72 overflow-hidden bg-stone-100">
                <div className="relative w-full h-72">
                  <Image
                    src={spice.images[0]}
                    alt={spice.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Spice Name Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
                  <h3 className="font-serif text-3xl md:text-4xl text-white mb-2 transform group-hover:translate-y-0 translate-y-2 transition-transform duration-300">
                    {spice.name}
                  </h3>
                  <p className="font-semibold text-xs uppercase tracking-widest text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {spice.forms.join(" & ")}
                  </p>
                </div>

                {/* Decorative Corner Element */}
                <div className="absolute top-4 right-4 w-16 h-16 border-2 border-accent/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform rotate-45" />
                <div className="absolute top-6 right-6 w-12 h-12 border-2 border-accent/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 transform rotate-45" />
              </div>

              {/* Hover Indicator */}
              <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="flex items-center gap-2 text-accent">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <span className="font-mono text-xs uppercase tracking-widest">Click to explore</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Modal Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white border border-primary/10 p-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {selectedSpice && (
            <div className="p-6 md:p-8">
              <DialogHeader className="mb-6">
                <DialogTitle className="font-serif text-3xl md:text-4xl text-accent mb-2 text-left">
                  {selectedSpice.name}
                </DialogTitle>
                <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground text-left">
                  {selectedSpice.forms.join(" & ")}
                </p>
              </DialogHeader>

              {/* Image Carousel in Modal */}
              <div className="relative h-80 md:h-96 w-full mb-8 overflow-hidden bg-stone-100">
                <Carousel className="w-full h-80 md:h-96">
                  <CarouselContent className="h-80 md:h-96 -ml-0">
                    {selectedSpice.images.map((img, idx) => (
                      <CarouselItem key={idx} className="h-80 md:h-96 pl-0 basis-full">
                        <div className="relative w-full h-80 md:h-96">
                          <Image
                            src={img}
                            alt={`${selectedSpice.name} - Image ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 800px"
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-4 bg-gray-700/90 hover:bg-black border border-primary/20" />
                  <CarouselNext className="right-4 bg-gray-700/90 hover:bg-black border border-primary/20" />
                </Carousel>
              </div>

              {/* Detailed Information */}
              <div className="space-y-6">
                {/* Origin */}
                <div className="flex items-start gap-4 pb-6 border-b border-primary/10">
                  <MapPin className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Origin
                    </h3>
                    <p className="font-sans text-sm text-black leading-relaxed">
                      {selectedSpice.origin}
                    </p>
                  </div>
                </div>

                {/* Biological Background */}
                <div className="flex items-start gap-4 pb-6 border-b border-primary/10">
                  <Leaf className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Biological Background
                    </h3>
                    <p className="font-sans text-sm text-black leading-relaxed">
                      {selectedSpice.biological}
                    </p>
                  </div>
                </div>

                {/* Usage */}
                <div className="flex items-start gap-4 pb-6 border-b border-primary/10">
                  <ChefHat className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Usage
                    </h3>
                    <p className="font-sans text-sm text-black leading-relaxed">
                      {selectedSpice.usage}
                    </p>
                  </div>
                </div>

                {/* Key Characteristics */}
                <div className="flex items-start gap-4">
                  <Sparkles className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                      Key Characteristics
                    </h3>
                    <p className="font-sans text-sm text-black leading-relaxed">
                      {selectedSpice.characteristics}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Call to Action Section */}
      <motion.section
        className="py-20 bg-primary text-primary-foreground px-6 relative overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto max-w-2xl text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl mb-4">Explore Our Collection</h2>
          <p className="font-sans text-lg opacity-90 mb-8">
            Experience the authentic flavors and heritage of these premium spices in your kitchen.
          </p>
          <motion.a
            href="/products"
            className="inline-block bg-accent text-accent-foreground font-medium px-8 py-3 hover:bg-accent/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View Products
          </motion.a>
        </div>
      </motion.section>

      <Footer />
    </div>
  );
}
