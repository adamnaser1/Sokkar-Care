import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/hooks/useLanguage';
import { getFoodItems, getRecipes, FoodItem, Recipe } from '@/data/foodData';
import { useAppStore } from '@/store/useAppStore';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Search, Clock, Flame, Wheat, LayoutGrid, List, X } from 'lucide-react';

const FoodDatabase = () => {
  const { t, language } = useLanguage();
  const incrementFoodsViewed = useAppStore(s => s.incrementFoodsViewed);
  const recipeCategoryFilter = useAppStore(s => s.recipeCategoryFilter);
  const setRecipeCategoryFilter = useAppStore(s => s.setRecipeCategoryFilter);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(t.food.categories[0]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [view, setView] = useState<'foods' | 'recipes'>('foods');
  const [recipeLayout, setRecipeLayout] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    if (recipeCategoryFilter) setView('recipes');
  }, [recipeCategoryFilter]);

  const foodItems = getFoodItems(language);
  const recipes = getRecipes(language);

  const filteredFoods = foodItems.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === t.food.categories[0] || f.category === category || (category === t.food.categories[6] && f.glutenFree);
    return matchSearch && matchCat;
  });

  const filteredRecipes = recipes.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = recipeCategoryFilter ? r.category === recipeCategoryFilter : true;
    return matchSearch && matchCat;
  }).sort((a,b) => a.carbs - b.carbs);

  const openFood = (food: FoodItem) => {
    setSelectedFood(food);
    incrementFoodsViewed();
  };

  const isRTL = language === 'ar';

  const giColor = (gi: number) => {
    if (gi <= 35) return 'text-success';
    if (gi <= 55) return 'text-warning';
    return 'text-destructive';
  };

  const giBg = (gi: number) => {
    if (gi <= 35) return 'bg-success/10';
    if (gi <= 55) return 'bg-warning/10';
    return 'bg-destructive/10';
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-foreground"
          >
            {t.food.title}
          </motion.h1>
          {view === 'recipes' && (
            <div className="flex bg-muted p-1 rounded-lg">
              <button 
                onClick={() => setRecipeLayout('grid')} 
                className={`p-1.5 rounded-md transition-colors ${recipeLayout === 'grid' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
              >
                <LayoutGrid size={16} />
              </button>
              <button 
                onClick={() => setRecipeLayout('list')} 
                className={`p-1.5 rounded-md transition-colors ${recipeLayout === 'list' ? 'bg-card shadow-sm text-primary' : 'text-muted-foreground'}`}
              >
                <List size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground ${isRTL ? 'right-4' : 'left-4'}`} size={18} />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={t.food.searchPlaceholder}
            className={`h-12 rounded-2xl bg-card border-border/50 text-sm ${isRTL ? 'pr-11' : 'pl-11'}`}
          />
        </div>

        {/* Tab Switch */}
        <div className="flex gap-1 mb-5 p-1 bg-muted rounded-2xl">
          {(['foods', 'recipes'] as const).map(v => (
            <motion.button
              key={v}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView(v)}
              className={`relative flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                view === v ? 'text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {view === v && (
                <motion.div
                  layoutId="food-tab"
                  className="absolute inset-0 bg-primary rounded-xl shadow-sm"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{v === 'foods' ? t.food.foods : t.food.recipes}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {view === 'foods' ? (
            <motion.div
              key="foods"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              {/* Category filters */}
              <div className="flex gap-2 overflow-x-auto pb-3 mb-4 scrollbar-hide">
                {t.food.categories.map((cat, i) => (
                  <motion.button
                    key={i}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setCategory(cat)}
                    className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      category === cat
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'bg-card text-muted-foreground card-shadow hover:bg-muted'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Food Grid */}
              <div className="grid grid-cols-2 gap-3">
                {filteredFoods.map((food, i) => (
                  <motion.button
                    key={food.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.02, duration: 0.25 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => openFood(food)}
                    className="p-4 rounded-2xl bg-card card-shadow text-left hover:shadow-md transition-shadow"
                  >
                    <span className="text-4xl block mb-2 text-center">{food.emoji}</span>
                    <p className={`text-sm font-semibold text-foreground mb-1 ${isRTL ? 'text-right' : 'text-left'}`}>{food.name}</p>
                    <div className={`flex items-center gap-2 text-[11px] text-muted-foreground ${isRTL ? 'justify-end' : 'justify-start'}`}>
                      <span className="flex items-center gap-0.5"><Wheat size={10} /> {food.carbs}g</span>
                      <span className="flex items-center gap-0.5"><Flame size={10} /> {food.calories}</span>
                    </div>
                    <span className={`inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${giColor(food.gi)} ${giBg(food.gi)}`}>
                      {t.food.giLabel}: {food.gi}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="recipes"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              {recipeCategoryFilter && (
                <div className={`bg-primary/10 border border-primary/20 p-3 rounded-2xl mb-4 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <span className="text-sm font-semibold text-primary">
                    {isRTL ? `اقتراحات: ${recipeCategoryFilter}` : `Suggestions pour: ${recipeCategoryFilter}`}
                  </span>
                  <button onClick={() => setRecipeCategoryFilter(null)} className="p-1 mt-0.5 text-primary bg-primary/20 rounded-full hover:bg-primary/30">
                    <X size={14} />
                  </button>
                </div>
              )}
              
              <div className={recipeLayout === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col gap-3'}>
              {filteredRecipes.map((recipe, i) => (
                <motion.button
                  key={recipe.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`p-0 rounded-2xl bg-card card-shadow overflow-hidden text-left hover:shadow-md transition-shadow relative ${
                    recipeLayout === 'grid' ? 'flex flex-col' : 'flex items-center h-28'
                  }`}
                >
                  <div className={`relative bg-muted flex-shrink-0 ${recipeLayout === 'grid' ? 'w-full h-32' : 'w-28 h-full'}`}>
                    {recipe.imageUrl ? (
                      <img src={recipe.imageUrl} alt={recipe.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl">{recipe.emoji}</span>
                      </div>
                    )}
                    <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'} bg-background/80 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 text-[10px] font-medium text-foreground`}>
                      <Clock size={10} className="text-primary" /> {recipe.time}{t.food.time}
                    </div>
                  </div>
                  
                  <div className={`p-3 w-full flex-1 flex flex-col justify-center ${isRTL ? 'text-right' : 'text-left'}`}>
                    <p className="font-semibold text-sm text-foreground line-clamp-1">{recipe.name}</p>
                    <div className={`flex flex-wrap gap-x-2 gap-y-1 mt-1.5 text-[10px] text-muted-foreground ${isRTL ? 'justify-end' : 'justify-start'}`}>
                      <span className="flex items-center gap-0.5"><Wheat size={10} className="text-secondary" /> {recipe.carbs}g</span>
                      <span className="flex items-center gap-0.5"><Flame size={10} className="text-orange-500" /> {recipe.calories} {t.food.kcal}</span>
                    </div>
                  </div>
                </motion.button>
              ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Food Detail Dialog */}
      <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent className="max-w-sm rounded-3xl p-6">
          {selectedFood && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center gap-3">
                  <span className="text-4xl">{selectedFood.emoji}</span>
                  <span className="text-xl">{selectedFood.name}</span>
                </DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-4 mt-2">
                <p className="text-sm text-muted-foreground font-medium">{t.food.portion} {selectedFood.portion}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: t.food.carbs, value: `${selectedFood.carbs}g`, accent: 'text-primary' },
                    { label: t.food.protein, value: `${selectedFood.protein}g`, accent: 'text-foreground' },
                    { label: t.food.fat, value: `${selectedFood.fat}g`, accent: 'text-foreground' },
                    { label: t.food.calories, value: `${selectedFood.calories} ${t.food.kcal}`, accent: 'text-foreground' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 rounded-xl bg-card border border-border/50 text-center shadow-sm">
                      <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
                      <p className={`font-bold text-lg ${item.accent}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="p-4 rounded-2xl bg-muted/30 text-center">
                  <p className="text-xs text-muted-foreground font-medium mb-2">{t.food.giLabel}</p>
                  <p className={`text-4xl font-bold ${giColor(selectedFood.gi)}`}>{selectedFood.gi}</p>
                  <p className="text-xs font-semibold mt-2 px-3 py-1 bg-background rounded-full inline-block card-shadow">
                    {selectedFood.gi <= 35 ? t.food.giLow : selectedFood.gi <= 55 ? t.food.giMedium : t.food.giHigh}
                  </p>
                </div>
                {selectedFood.glutenFree && (
                  <span className="text-xs px-3 py-1.5 rounded-full bg-success/10 text-success self-start font-medium">
                    {t.food.glutenFreeLabel}
                  </span>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
        <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto rounded-3xl p-0 hide-scrollbar shadow-2xl border-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{selectedRecipe?.name || 'Recipe'}</DialogTitle>
          </DialogHeader>
          {selectedRecipe && (
            <div className="flex flex-col relative w-full h-full pb-4">
              <button 
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full bg-background/80 backdrop-blur-md text-foreground hover:bg-background transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
              <div className="relative w-full h-[200px] bg-muted flex-shrink-0">
                {selectedRecipe.imageUrl ? (
                  <img src={selectedRecipe.imageUrl} alt={selectedRecipe.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    {selectedRecipe.emoji}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h2 className="text-xl font-bold text-foreground mb-1">{selectedRecipe.name}</h2>
                  <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                    <span className="flex items-center gap-1 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md text-primary">
                      <Clock size={12} /> {selectedRecipe.time} {t.food.time}
                    </span>
                    <span className="flex items-center gap-1 bg-background/50 backdrop-blur-md px-2 py-1 rounded-md">
                      <Flame size={12} className="text-orange-500" /> {selectedRecipe.calories} {t.food.kcal}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="px-6 py-4 flex flex-col gap-6">
                <div className="flex justify-between p-4 rounded-2xl bg-muted/30 border border-border/50 shadow-sm">
                  <div className="text-center flex-1">
                    <span className="text-[11px] text-muted-foreground font-medium uppercase mb-1 block">{t.food.carbs}</span>
                    <p className="font-bold text-blue-500 text-lg">{selectedRecipe.carbs}g</p>
                  </div>
                  <div className="w-px bg-border/50 mx-2" />
                  <div className="text-center flex-1">
                    <span className="text-[11px] text-muted-foreground font-medium uppercase mb-1 block">{t.food.protein}</span>
                    <p className="font-bold text-emerald-500 text-lg">{selectedRecipe.protein}g</p>
                  </div>
                  <div className="w-px bg-border/50 mx-2" />
                  <div className="text-center flex-1">
                    <span className="text-[11px] text-muted-foreground font-medium uppercase mb-1 block">{t.food.fat}</span>
                    <p className="font-bold text-orange-400 text-lg">{selectedRecipe.fat || 0}g</p>
                  </div>
                </div>
                
                <div>
                  <h4 className={`font-bold text-foreground mb-3 text-sm flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <span className="w-6 h-6 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-xs">📝</span>
                    {t.food.ingredients}
                  </h4>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {selectedRecipe.ingredients.map((ing, i) => (
                      <li key={i} className={`flex items-center gap-3 p-2 rounded-xl bg-card border border-border/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                         <div className="w-2 h-2 rounded-full bg-primary/40 flex-shrink-0" />
                         <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mb-2">
                  <h4 className={`font-bold text-foreground mb-4 text-sm flex items-center gap-2 ${isRTL ? 'justify-end' : 'justify-start'}`}>
                    <span className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">👨‍🍳</span>
                    {t.food.instructions}
                  </h4>
                  <ol className="text-sm text-muted-foreground space-y-4 relative before:absolute before:top-2 before:bottom-2 before:w-0.5 before:bg-border/60 before:left-3.5">
                    {selectedRecipe.instructions.map((step, i) => (
                      <li key={i} className={`flex gap-4 relative ${isRTL ? 'flex-row-reverse before:right-3.5 before:left-auto' : ''}`}>
                        <span className="flex-shrink-0 w-7 h-7 rounded-full bg-background border-2 border-primary text-primary flex items-center justify-center text-xs font-bold relative z-10 shadow-sm mt-0.5">
                          {i + 1}
                        </span>
                        <span className="pt-1.5 leading-relaxed flex-1">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <div className="pt-2">
                  <Button 
                    onClick={() => {
                      toast.success(isRTL ? 'تمت الإضافة إلى اليوميات!' : 'Ajouté au journal du jour !');
                      setSelectedRecipe(null);
                    }}
                    className="w-full h-12 rounded-2xl text-base font-semibold shadow-md active:scale-95 transition-transform"
                  >
                    + {isRTL ? 'أضف إلى اليوميات' : 'Ajouter au journal du jour'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FoodDatabase;
