import { MongoDoc } from '../types'
import { computed, Ref, SetupContext } from '@vue/composition-api'
import getModMongoDoc from './getModMongoDoc'
/**
 * ! Only for use in vue components
 * Adds new data for Adks array in existing mongo document
 * Will create ADK using defaultADKProperties if it doesnt exist
 * @param {Ref<MongoDoc>} programDocProp
 * @param {SetupContext['emit']} ctx
 * @param {string} adkName
 * @param {Record<string, any>} [defaultADKProperties]
 * @return {*}
 */
const getModAdk = (
  programDocProp: Ref<MongoDoc>,
  ctx: SetupContext['emit'],
  adkName: string,
  defaultADKProperties?: Record<string, any>,
) => {
  const { programDoc } = getModMongoDoc(programDocProp, ctx)

  let adkIndex = (programDoc.value.data.adks as any[]).findIndex(
    (obj: Record<string, any>) => {
      return obj.name === adkName
    },
  )

  if (adkIndex === -1) { adkIndex = programDoc.value.data.adks.push({ name: adkName }) - 1 }

  if (defaultADKProperties !== undefined) {
    programDoc.value.data.adks[adkIndex] = {
      ...defaultADKProperties,
      ...programDoc.value.data.adks[adkIndex],
    }
  }

  const adkData = computed({
    get: () => programDoc.value.data.adks[adkIndex],
    set: newVal => {
      programDoc.value.data.adks[adkIndex] = newVal
    },
  })

  return {
    adkData,
    adkIndex,
  }
}
export default getModAdk