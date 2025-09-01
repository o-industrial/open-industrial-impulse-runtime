import { IoCContainer } from '@fathym/ioc';
import { EverythingAsCode } from '@fathym/eac';
import { EaCRuntimeConfig, EaCRuntimePluginConfig } from '@fathym/eac/runtime/config';
import { EaCRuntimePlugin } from '@fathym/eac/runtime/plugins';
import { EverythingAsCodeApplications } from '@fathym/eac-applications';
import { OpenIndustrialGlobalDataIngestPlugin } from '@o-industrial/common/runtimes';
import { DefaultOIImpulseProcessorHandlerResolver } from './DefaultOIImpulseProcessorHandlerResolver.ts';
import { EaCProxyProcessor } from '@fathym/eac-applications/processors';

export default class RuntimePlugin implements EaCRuntimePlugin {
  constructor() {}

  public Setup(config: EaCRuntimeConfig) {
    const pluginConfig: EaCRuntimePluginConfig<
      EverythingAsCode & EverythingAsCodeApplications
    > = {
      Name: RuntimePlugin.name,
      Plugins: [
        new OpenIndustrialGlobalDataIngestPlugin(
          'core',
          Deno.env.get('NATS_SERVER')!,
          Deno.env.get('NATS_TOKEN')!,
          Deno.env.get('AZURE_IOT_HUB_EVENT_HUB_CONNECTION_STRING')!,
          Deno.env.get('AZURE_IOT_HUB_EVENT_HUB_NAME')!,
          Deno.env.get('AZURE_IOT_HUB_CONNECTION_STRING')!,
          Deno.env.get('OPEN_INDUSTRIAL_API_ROOT')!,
        ),
      ],
      IoC: new IoCContainer(),
      EaC: {
        Projects: {
          core: {
            Details: {
              Priority: 100,
            },
            ResolverConfigs: {
              localhost: {
                Hostname: 'localhost',
                Port: config.Servers![0].port || 8000,
              },
              '127.0.0.1': {
                Hostname: '127.0.0.1',
                Port: config.Servers![0].port || 8000,
              },
              'host.docker.internal': {
                Hostname: 'host.docker.internal',
                Port: config.Servers![0].port || 8000,
              },
              'open-industrial.fathym.com': {
                Hostname: 'open-industrial.fathym.com',
              },
              'www.openindustrial.co': {
                Hostname: 'www.openindustrial.co',
              },
              'open-industrial-impulse-runtime.azurewebsites.net': {
                Hostname: 'open-industrial-impulse-runtime.azurewebsites.net',
              },
            },
            ModifierResolvers: {},
            ApplicationResolvers: {
              web: {
                PathPattern: '*',
                Priority: 100,
              },
            },
          },
        },
        Applications: {
          web: {
            Details: {
              Name: 'Web Temp',
              Description: 'Web Temp.',
            },
            ModifierResolvers: {},
            Processor: {
              Type: 'Proxy',
              ProxyRoot: 'https://www.fathym.com',
            } as EaCProxyProcessor,
          },
        },
      },
    };

    pluginConfig.IoC!.Register(DefaultOIImpulseProcessorHandlerResolver, {
      Type: pluginConfig.IoC!.Symbol('ProcessorHandlerResolver'),
    });

    return Promise.resolve(pluginConfig);
  }
}
