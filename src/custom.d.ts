declare module '*.svg' {
    const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
    export default content;
}

declare module '*.scss' {
    const content: { [className: string]: string };
    export = content;
}

// Type for unpacking nodes
// based on https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#type-inference-in-conditional-types

type UnpackNodesType<T> = T extends readonly (infer U)[] ? U : never;
