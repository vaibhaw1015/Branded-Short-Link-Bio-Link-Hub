import { customAlphabet } from 'nanoid';

// Alphabet strictly excluding ambiguous characters: no 0, O, l, 1, I
const UNAMBIGUOUS_ALPHABET = '23456789abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ';

const nanoid6 = customAlphabet(UNAMBIGUOUS_ALPHABET, 6);

export const generateSlug = () => {
  return nanoid6();
};
