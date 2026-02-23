import React from 'react';
import { UINodeSchema } from '@/lib/schema/ui-spec';

// Layout
import { Stack } from '../blocks/layout/Stack';
import { Grid } from '../blocks/layout/Grid';
import { Tabs } from '../blocks/layout/Tabs';
import { Accordion } from '../blocks/layout/Accordion';
import { Columns } from '../blocks/layout/Columns';

// Content
import { Hero } from '../blocks/content/Hero';
import { WikiSection } from '../blocks/content/WikiSection';
import { InfoCard } from '../blocks/content/InfoCard';
import { StatCard } from '../blocks/content/StatCard';
import { Table } from '../blocks/content/Table';
import { Image } from '../blocks/content/Image';
import { Callout } from '../blocks/content/Callout';
import { Divider } from '../blocks/content/Divider';

// Interactive
import { Quiz } from '../blocks/interactive/Quiz';
import { Form } from '../blocks/interactive/Form';
import { FileUpload } from '../blocks/interactive/FileUpload';
import { Slider } from '../blocks/interactive/Slider';
import { Chart } from '../blocks/interactive/Chart';
import { ProgressTracker } from '../blocks/interactive/ProgressTracker';

const ComponentMap: Record<string, React.FC<any>> = {
 // Layout
 Stack,
 Grid,
 Tabs,
 Accordion,
 Columns,
 // Content
 Hero,
 WikiSection,
 InfoCard,
 StatCard,
 Table,
 Image,
 Callout,
 Divider,
 // Interactive
 Quiz,
 Form,
 FileUpload,
 Slider,
 Chart,
 ProgressTracker
};

interface BlockRendererProps {
 node: UINodeSchema;
}

export const BlockRenderer: React.FC<BlockRendererProps> = ({ node }) => {
 if (!node) return null; // Gracefully handle partial streaming undefined nodes

 const Component = ComponentMap[node.type];

 if (!Component) {
 console.warn(`Unknown component type: ${node.type}`);
 return null;
 }

 // Recursively render children if it's a layout block
 const children = node.children?.map((child, idx) => (
 <BlockRenderer key={`${child.type}-${idx}`} node={child} />
 ));

 return (
 <Component {...node.props}>
 {children}
 </Component>
 );
};
