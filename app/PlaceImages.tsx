'use client'

import FeatureImage from './FeatureImage'
import { ZoneImages } from './ZoneImages'

export default function PlaceImages({ panoramaxImages, bboxImages, zoneImages, mainImage, wikiFeatureImage, searchParams, focusImage }) {

  console.log('panoramaxImages', panoramaxImages)
  console.log('bboxImages', bboxImages)
  console.log('zoneImages', zoneImages)
  console.log('mainImage', mainImage)
  console.log('wikiFeatureImage', wikiFeatureImage)

  return (panoramaxImages
    || bboxImages.length > 0
    || zoneImages
    || mainImage
    || wikiFeatureImage) ? (

    <div
      css={`
          padding: 0 1rem;
        `}
    >

      {mainImage && (
        <FeatureImage
          src={mainImage}
          isMainImage={true}
        />
      )}

      {wikiFeatureImage && (
        <FeatureImage
          src={wikiFeatureImage}
          isMainImage={true}
        />
      )}

      <ZoneImages
        zoneImages={
          searchParams.photos === 'oui' && bboxImages?.length > 0
            ? bboxImages
            : zoneImages
        } // bbox includes zone, usually
        panoramaxImages={panoramaxImages}
        focusImage={focusImage}
      />

    </div>
  ) : null
}
