<?php

namespace Drupal\custom\Plugin\GraphQL\Directive;

use Drupal\Core\Plugin\PluginBase;
use Drupal\Core\Render\RenderContext;
use Drupal\graphql\GraphQL\Execution\FieldContext;
use Drupal\graphql\GraphQL\Execution\ResolveContext;
use Drupal\graphql\GraphQL\ResolverBuilder;
use Drupal\graphql_directives\DirectiveInterface;
use Drupal\graphql\GraphQL\Resolver\ResolverInterface;
use Drupal\webform\Entity\Webform;
use GraphQL\Type\Definition\ResolveInfo;

/**
 * @Directive(
 *   id = "webformIdToUrl",
 *   description = "Takes webform ID. Returns webform Url.",
 * )
 */
class WebformIdToUrl extends PluginBase implements DirectiveInterface {

  public function buildResolver(ResolverBuilder $builder, array $arguments): ResolverInterface {
    // TODO: Convert to a data producer to be schema-cache-ready.
    //  https://github.com/drupal-graphql/graphql/issues/948#issuecomment-558715765
    return $builder->callback(function (
      $webformId,
      $args,
      ResolveContext $context,
      ResolveInfo $info,
      FieldContext $field,
    ) {
      if (!$webformId) {
        return NULL;
      }

      /** @var \Drupal\Core\Render\RendererInterface $renderer */
      $renderer = \Drupal::service('renderer');
      $renderContext = new RenderContext();

      $result = $renderer->executeInRenderContext(
        $renderContext,
        function () use ($field, $webformId) {
          $webform = Webform::load($webformId);
          if (!$webform || !$webform->isOpen()) {
            return NULL;
          }
          $field->addCacheableDependency($webform);
          return $webform->toUrl()->setAbsolute()->toString();
        },
      );

      if (!$renderContext->isEmpty()) {
        $field->addCacheableDependency($renderContext->pop());
      }

      return $result;
    });
  }

}
