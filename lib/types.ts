export interface Category {
    id: string;
    nome: string;
    descricao?: string;
  }
  
  export interface Expense {
    id: string;
    valor: number;
    data: string;
    natureza: string;
    categoryId: string;
    category: Category;
  }
  
  export const NaturezaGastoValues = ['NECESSARIO', 'SUPÉRFLUO', 'EMERGENCIAL'] as const;
  
  export type NaturezaGasto = typeof NaturezaGastoValues[number]; 