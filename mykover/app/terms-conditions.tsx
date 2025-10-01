import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome6 } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function TermsConditionsScreen() {
  const sections = [
    `Le service MyKover vous est fourni dans les Termes et Conditions suivants. En utilisant ce Service, vous marquez votre adhésion aux Termes et Conditions présents.`,
    
    `Sous réserve de l'article 6, l'accès de base à MyKover est fourni sans frais. Cependant, pour bénéficier des avantages liés à l'assurance santé, vous êtes chargés de souscrire à un plan d'assurance et de payer les primes correspondantes. Ces frais comprennent :

Frais de souscription pour les offres en prépayé

Redevance mensuelle pour les offres en postpayé

Facturation à la carte (Pay As You Go) pour les services additionnels`,
    
    `Dans le cas où MyKover constate que vous abusez de quelque façon que ce soit du service, notamment la fraude à l'assurance, la fourniture de fausses informations médicales, ou toute autre activité illicite, MyKover se réserve le droit de modérer votre consommation et dans les cas extrêmes, elle peut limiter l'accès aux services, suspendre votre couverture ou même résilier votre contrat.`,
    
    `Pour accéder au service, vous devez fournir certaines informations dans le cadre de votre inscription et fournir, à cet effet, des informations vraies, exactes, actuelles et complètes sur vous tel que requis dans tout formulaire d'inscription, et informer MyKover de tout éventuel changement, particulièrement concernant votre état de santé et vos informations personnelles.`,
    
    `En tant qu'utilisateur du service, vous acceptez que MyKover ou ses agents puissent vous contacter par email, SMS ou téléphone afin de vous tenir informer du service et toutes questions connexes y afférentes qui pourront affecter son utilisation, y compris les rappels de renouvellement, les mises à jour de couverture, et les communications relatives à votre santé.`,
    
    `Vous acceptez que toutes les informations fournies et toutes les réclamations soumises respectent les lois et règlements en vigueur et que vous soyez seul responsable du contenu de tous les messages envoyés et reçus par l'intermédiaire du Service.

Vous ne devez pas :

encourager, permettre, ou vous engager dans toute activité illégale ou illicite, y compris, la fraude à l'assurance, la transmission de fausses informations médicales, la falsification de documents médicaux, violation de droit d'auteur ou la publication d'informations diffamatoires

Violer le système ou la sécurité du réseau de MyKover en essayant d'obtenir un accès non autorisé pour l'utilisation des données, systèmes ou réseaux, y compris toute tentative de sonder, scanner ou tester la vulnérabilité du système ou réseau ou d'enfreindre la sécurité ou les mesures d'authentification sans l'autorisation expresse du propriétaire du système ou du réseau

Interférer dans le service auprès de tout utilisateur, hôte ou réseau, y compris, sans limitation, mail bombing, inondation, déni de service (DOS) attaques, des tentatives délibérées de surcharger un système, d'autres actions avec l'intention de nuire, ou

envoyer des courriels non sollicités ("spamming" et / ou "Spam"), envoyer du spam sur les forums de discussion, en violation des règlements relatifs aux groupes de discussion ou par toute autre manière, violer les coutumes et les pratiques d'utilisation de l'Internet.Vous acceptez que MyKover puisse résilier avec ou sans préavis le présent contrat en cas de violation de l'une des dispositions`,
    
    `Vous êtes responsables de la sécurité de votre mot de passe et ne devez le divulguer à des tiers. Vous êtes également responsable de la confidentialité de vos informations médicales et de l'accès à votre compte.`,
    
    `Vous acceptez d'indemniser MyKover (et sa société mère, filiales, sociétés affiliées, dirigeants et employés) pour tous les coûts, dommages, responsabilités et pertes (y compris les frais juridiques) subis ou engagés par MyKover à la suite de toute réclamation faite par une tierce partie découlant de votre utilisation, connexion au Service ou toute violation de vos obligations en vertu des présents Termes et Conditions.`,
    
    `MyKover pourra résilier le Service, à tout moment, et suspendre l'utilisation du Service pour n'importe quelle raison, dans les cas suivants mais non limitatif :

si MyKover estime que l'utilisateur n'a pas respecté les termes du présent contrat

si MyKover est dans l'impossibilité de continuer à fournir le service pour des raisons contractuelles, économiques ou opérationnelles.`,
    
    `En cas de résiliation pour les raisons cités à l'article 9, MyKover enverra un préavis minimum de 30 Jours envoyé par tout moyen écrit avec accusé de réception.MyKover peut également mettre immédiatement fin sans préavis à votre accès au Service, si vous ne parvenez pas à l'utiliser au moins une fois pendant une période de 90 jours. De même, vous pouvez résilier cet Accord et demander l'arrêt du Service à tout moment en s'abstenant de l'utiliser pendant une période de 90 jours sans préavis.MyKover peut immédiatement après la résiliation, supprimer tous les fichiers électroniques stockés par celle-ci.Si, pendant la durée de cet accord, le service vous est facturé, la demande de résiliation du Service par vous ne sera effective qu'à la fin du cycle de facturation normal auquel vous avez payé ledit service. Dans le cas où MyKover résilie le présent accord, vous serez remboursé des sommes versées à l'avance de la date de résiliation, au prorata de la date de résiliation.`,
    
    `Vous reconnaissez et acceptez que les droits de propriété intellectuelle dans le cadre de ce service restent la propriété de MyKover ou de ses concédants. Vous êtes autorisés à utiliser le Service matériel et les informations fournies à travers le service suivant ce qui est expressément autorisé en vertu des présents Termes et Conditions. Vous ne pouvez pas utiliser le contenu du matériel ou cette information ou de toute partie du Service, sans l'autorisation écrite expresse de MyKover.`,
    
    `Le Service est fourni "tel quel" et "suivant sa disponibilité".MyKover exclut par les présentes toutes les conditions, garanties, représentations ou d'autres conditions relatives à la disponibilité ou la performance du service, que ce soit, expresse ou implicite, y compris les conditions, garanties, représentations ou d'autres conditions, de qualité de satisfaction, adéquation à un usage particulier et de non-contrefaçon.En particulier, MyKover ne donne aucune garantie que le service répondra à vos exigences, qu'il n'y aura aucune interruption ou qu'il sera exempt d'erreurs, délais ou sécurisé; quant aux résultats qui peuvent être obtenus à partir de l'utilisation du Service; quant à l'exactitude ou la fiabilité de toute information obtenue via le Service; ou concernant des biens ou services achetés ou obtenus par l'intermédiaire ou auprès du Service ou de toute transaction conclue par l'intermédiaire de service.MyKover décline toute responsabilité pour les coûts ou dommages résultant de toute interruption, suspension ou interruption du Service.`,
    
    `Les présents Termes et Conditions constituent l'accord intégral entre l'utilisateur et MyKover et remplacent toutes les précédentes conventions, arrangements ou des représentations faites par l'autre partie concernant le Service.Les présentes Conditions Générales sont régies par les lois de la République Démocratique du Congo et les deux parties se soumettent à la compétence exclusive des tribunaux de la République Démocratique du Congo en cas de litige.`
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <FontAwesome6 name="arrow-left" size={20} color="#000" />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Conditions générales</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Main Title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>Conditions générales de service - Assurance Santé MyKover</Text>
          <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>
            Veuillez lire attentivement ces conditions générales qui régissent l'utilisation des services d'assurance santé MyKover.
          </Text>
        </View>

        {/* Terms Sections */}
        {sections.map((content, index) => (
          <View key={index} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 14, color: '#333', lineHeight: 20 }}>{content}</Text>
          </View>
        ))}
        {/* Simple Footer */}
                <View style={{ 
                  paddingTop: 20, 
                  borderTopWidth: 1, 
                  borderTopColor: '#e5e5e5',
                  alignItems: 'center'
                }}>
                  <Text style={{ 
                    fontSize: 14, 
                    color: '#666', 
                    textAlign: 'center',
                    marginBottom: 8
                  }}>
                    MyKover © 2025
                  </Text>
                  <Text style={{ 
                    fontSize: 12, 
                    color: '#999', 
                    textAlign: 'center'
                  }}>
                    Assurance santé numérique pour tous
                  </Text>
                </View>
      </ScrollView>
    </SafeAreaView>
  );
}