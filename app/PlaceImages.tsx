'use client'

import FeatureImage from './FeatureImage'
import { ZoneImages } from './ZoneImages'

export default function PlaceImages({panoramaxImages, bboxImages, zoneImages, mainImage, wikiFeatureImage, searchParams, focusImage}) {

  return (panoramaxImages 
    || bboxImages.length > 0 
    || zoneImages 
    || mainImage 
    || wikiFeatureImage) && (

    <div className="sidesheet-images">

      {mainImage && (
        <FeatureImage
          src={mainImage}
          className="main-image"
        />
      )}

      {wikiFeatureImage && (
        <FeatureImage
          src={wikiFeatureImage}
          className="main-image"
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
  )
}
