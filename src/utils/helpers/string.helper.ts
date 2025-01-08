export const isContainsHTMLTags = (str?: string) => (!!str ? /<\/?[a-z][\s\S]*>/i.test(str) : false);
