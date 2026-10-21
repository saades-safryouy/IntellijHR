import {FeaturesBento} from "./FeaturesBento";
import {Section, SectionHeading, useLanding} from "./LandingPrimitives";

export function PlatformOverview() {
    const {t} = useLanding();
    return (
        <Section id="features">
            <SectionHeading
                eyebrow={t.overview.eyebrow}
                lines={[t.overview.title1, t.overview.title2]}
                desc={t.overview.desc}/>
            <FeaturesBento/>
        </Section>
    );
}
